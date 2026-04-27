import type { Request, Response } from "express";
import { supabaseAdmin } from "../db.js";
import { sendSlackWebhookNotification } from "../services/slackService.js";
import { signupRequestTemplate } from "../schemas/slackTemplates.js";

export async function SignupRequest(req: Request, res: Response) {
  try {
    const { email, user_name, entrepreneurship_name, role } = req.body;

    if (!email || !user_name || !role)
      return res
        .status(400)
        .json({ error: "Los campos de email, nombre y rol son obligatorios" });

    const rolesArray = Array.isArray(role) ? role : [role];

    const { data, error } = await supabaseAdmin
      .from("signup_request")
      .insert([{ email, user_name, entrepreneurship_name, role: rolesArray }]);

    if (error) return res.status(400).json({ error: error.message });

    const webhookUrl = process.env.SLACK_WEBHOOK_URL_IT;
    if (webhookUrl) {
      const template = signupRequestTemplate(
        user_name,
        email,
        entrepreneurship_name || "",
        rolesArray,
      );
      await sendSlackWebhookNotification(webhookUrl, template);
    }

    res.status(201).json({ message: "Successful signup request " });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function GetPendingRequests(req: Request, res: Response) {
  try {
    // Consultamos la tabla filtrando por el estado que consideres "pendiente"
    // Si no tienes una columna de status, puedes quitar el .eq()
    const { data, error } = await supabaseAdmin
      .from("signup_request")
      .select("*")
      .eq("status", "PENDIENTE") // Ajusta el string según tu base de datos
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching pending requests:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

export async function ApproveSignup(req: Request, res: Response) {
  const { requestId } = req.params; // El ID de la tabla signup_request

  try {
    // 1. Obtener los datos de la solicitud
    const { data: request, error: fetchError } = await supabaseAdmin
      .from("signup_request")
      .select("*")
      .eq("id", requestId)
      .single();
    if (fetchError || !request) {
      return res.status(404).json({ error: fetchError });
    }

    // 2. Crear el usuario en Supabase Auth
    const rolesArray = Array.isArray(request.role)
      ? request.role
      : [request.role];
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.inviteUserByEmail(request.email, {
        redirectTo:
          "https://freelance-entrepreneurships-fronten.vercel.app/reset-password",
        data: {
          name: request.user_name,
          entrepreneurship_name: request.entrepreneurship_name,
          roles: rolesArray,
        },
      });

    if (authError) return res.status(400).json({ error: authError.message });

    // 3. Marcar la solicitud como aprobada
    await supabaseAdmin
      .from("signup_request")
      .update({ status: "APROBADO" }) // Asegúrate de tener este ENUM o columna
      .eq("id", requestId);

    res.status(200).json({
      message: "Proveedor aprobado y correo de invitación enviado",
      user: authUser.user,
    });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function RejectSignup(req: Request, res: Response) {
  const { requestId } = req.params;

  try {
    // Actualizamos el estado a RECHAZADO (o el valor exacto de tu ENUM)
    const { data, error } = await supabaseAdmin
      .from("signup_request")
      .update({ status: "RECHAZADO" }) // Asegúrate de que coincida con tu tipo ENUM
      .eq("id", requestId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (!data) {
      return res.status(404).json({ error: "Solicitud no encontrada" });
    }

    res.status(200).json({ message: "Solicitud rechazada correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function Login(req: Request, res: Response) {
  const { email, password } = req.body;

  try {
    // 1. Validar que vengan los datos
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email y contraseña son requeridos" });
    }

    // 2. Intentar inicio de sesión en Supabase Auth
    const { data, error } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Error común: "Invalid login credentials"
      return res.status(401).json({ error: error.message });
    }

    // 3. Si es exitoso, devolvemos la sesión y el usuario
    // El 'session' contiene el access_token que usará el frontend
    return res.status(200).json({
      message: "Login exitoso",
      session: data.session,
      user: data.user,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
