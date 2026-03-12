import z from "zod";

export type UserRole = "IT" | "ADMIN" | "PROVEEDOR";
export type RequestStatus = "PENDIENTE" | "APROBADO" | "RECHAZADO";

export interface Consumer {
	cedula: string;
	name: string;
	department?: string;
	slack_id: string;
}

export interface Product {
	id: string;
	entrepreneurship_id: string;
	name: string;
	price: number;
	current_stock: number;
	image?: string;
	is_active: boolean;
}

export interface Sale {
	consumer_id: string;
	product_id: string;
	quantity: number;
	unit_price: number;
	total: number;
	sale_date: string;
	payroll_processed: boolean;
}

export interface Entrepreneurship {
	id: string;
	owner_id: string;
	name: string;
	is_active: boolean;
}

export interface Signup_request {
	id: string;
	email: string;
	user_name: string;
	entrepreneurship_name: string;
	status: RequestStatus;
	reviewed_by: string;
}

export interface User {
	id: string;
	name: string;
	role: UserRole;
	email: string;
	is_approved: boolean;
}

// --- Esquema para Registro de Consumo (Tablet) ---
export const PurchaseSchema = z.object({
	cedula: z.string().min(5, "La cédula debe tener al menos 5 dígitos"),
	productId: z.uuid("ID de producto inválido"),
	quantity: z
		.number()
		.int()
		.positive("La cantidad debe ser un entero positivo"),
});

// --- Esquema para Solicitud de Registro (Proveedores) ---
export const RegistrationRequestSchema = z.object({
	email: z.email("Formato de correo inválido"),
	nombre_solicitante: z.string().min(3, "Nombre demasiado corto"),
	nombre_emprendimiento: z
		.string()
		.min(2, "Nombre de emprendimiento requerido"),
});

// --- Extraer los Tipos de TypeScript de los esquemas ---
export type PurchaseInput = z.infer<typeof PurchaseSchema>;
export type RegistrationRequestInput = z.infer<
	typeof RegistrationRequestSchema
>;
