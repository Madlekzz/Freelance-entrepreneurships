import type { Request, Response } from "express";
import z from "zod";
import { supabaseAdmin } from "../db.js";

const BinanceDataSchema = z.object({
	binance_id: z.string().min(1, "Binance ID requerido").max(200),
	correo_electronico: z.email("Correo electrónico inválido"),
});

const PagoMovilDataSchema = z.object({
	banco: z.string().min(1, "Banco requerido").max(200),
	numero_telefonico: z.string().min(7, "Teléfono inválido").max(20),
	cedula: z.string().min(5, "Cédula inválida").max(20),
});

const EfectivoDataSchema = z.object({}).default({});

const dataSchemas: Record<string, z.ZodTypeAny> = {
	efectivo: EfectivoDataSchema,
	binance: BinanceDataSchema,
	pago_movil: PagoMovilDataSchema,
};

// GET /api/entrepreneur-payment-data/me
// Authenticated user gets their own payment data for all methods
export async function getMyPaymentData(req: Request, res: Response) {
	const userId = req.user?.id;
	if (!userId) {
		return res.status(401).json({ error: "No autorizado" });
	}

	try {
		const { data, error } = await supabaseAdmin
			.from("entrepreneur_payment_data")
			.select("*")
			.eq("user_id", userId);

		if (error) throw error;
		res.status(200).json(data ?? []);
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Error al obtener datos de pago";
		console.error("[getMyPaymentData Error]:", message);
		res.status(500).json({ error: "Error interno del servidor" });
	}
}

// PUT /api/entrepreneur-payment-data/:method
// Upsert payment data for a specific method
export async function upsertPaymentData(req: Request, res: Response) {
	const userId = req.user?.id;
	if (!userId) {
		return res.status(401).json({ error: "No autorizado" });
	}

	const method = req.params.method;
	const validMethods = ["efectivo", "binance", "pago_movil"];
	if (typeof method !== "string" || !validMethods.includes(method)) {
		return res.status(400).json({
			error: `Método de pago inválido. Debe ser uno de: ${validMethods.join(", ")}`,
		});
	}

	const { data: bodyData, is_active } = req.body;

	// Validate payment data against schema
	const schema = dataSchemas[method as keyof typeof dataSchemas];
	let validatedData: Record<string, unknown> = {};
	if (schema) {
		const parsed = schema.safeParse(bodyData);
		if (!parsed.success) {
			return res.status(400).json({
				error: `Datos inválidos para ${method}: ${parsed.error.issues.map((i) => i.message).join(", ")}`,
			});
		}
		validatedData = parsed.data as Record<string, unknown>;
	} else {
		validatedData = bodyData ?? {};
	}

	try {
		const { data, error } = await supabaseAdmin
			.from("entrepreneur_payment_data")
			.upsert(
				{
					user_id: userId,
					payment_method: method,
					data: validatedData,
					is_active: is_active !== undefined ? is_active : true,
					updated_at: new Date().toISOString(),
				},
				{
					onConflict: "user_id, payment_method",
					ignoreDuplicates: false,
				},
			)
			.select()
			.single();

		if (error) throw error;
		res.status(200).json(data);
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Error al guardar datos de pago";
		console.error("[upsertPaymentData Error]:", message);
		res.status(500).json({ error: "Error interno del servidor" });
	}
}

// POST /api/entrepreneur-payment-data/batch
// Get payment data for multiple products (resolves owner data server-side)
export async function getBatchPaymentData(req: Request, res: Response) {
	try {
		const { product_ids } = req.body;

		if (!Array.isArray(product_ids) || product_ids.length === 0) {
			return res
				.status(400)
				.json({ error: "Se requiere un array de product_ids" });
		}

		if (product_ids.length > 50) {
			return res
				.status(400)
				.json({ error: "Máximo 50 productos por consulta" });
		}

		// 1. Resolve the entrepreneurship IDs from the products
		const { data: products, error: prodError } = await supabaseAdmin
			.from("products")
			.select("entrepreneurship_id")
			.in("id", product_ids);

		if (prodError) {
			console.error(
				"[getBatchPaymentData] Error fetching products:",
				prodError,
			);
			return res.status(500).json({ error: "Error al obtener datos de pago" });
		}

		if (!products || products.length === 0) {
			return res.json([]);
		}

		const entrepreneurshipIds = [
			...new Set(products.map((p) => p.entrepreneurship_id)),
		];

		// 2. Resolve the owner IDs from the entrepreneurships
		const { data: entrepreneurships, error: entError } = await supabaseAdmin
			.from("entrepreneurships")
			.select("id, name, owner_id")
			.in("id", entrepreneurshipIds);

		if (entError) {
			console.error(
				"[getBatchPaymentData] Error fetching entrepreneurships:",
				entError,
			);
			return res.status(500).json({ error: "Error al obtener datos de pago" });
		}

		if (!entrepreneurships || entrepreneurships.length === 0) {
			return res.json([]);
		}

		const ownerIds = [...new Set(entrepreneurships.map((e) => e.owner_id))];

		// 3. Fetch payment data for those owners
		const { data: paymentData, error: payError } = await supabaseAdmin
			.from("entrepreneur_payment_data")
			.select("id, user_id, payment_method, data, is_active, updated_at")
			.in("user_id", ownerIds)
			.eq("is_active", true);

		if (payError) {
			console.error(
				"[getBatchPaymentData] Error fetching payment data:",
				payError,
			);
			return res.status(500).json({ error: "Error al obtener datos de pago" });
		}

		// 4. Enrich payment data with entrepreneurship names per owner
		const enriched = (paymentData ?? []).map((pd) => {
			const ownerEntrepreneurships = entrepreneurships
				.filter((e) => e.owner_id === pd.user_id)
				.map((e) => e.name);
			return {
				...pd,
				entrepreneurship_names: ownerEntrepreneurships.join(", "),
			};
		});

		return res.json(enriched);
	} catch (error: unknown) {
		const message =
			error instanceof Error ? error.message : "Error desconocido";
		console.error("[getBatchPaymentData Error]:", message);
		return res.status(500).json({ error: "Error al obtener datos de pago" });
	}
}
