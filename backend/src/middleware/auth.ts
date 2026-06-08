import type { User } from "@supabase/supabase-js";
import type { NextFunction, Request, Response } from "express";
import { supabaseAuth } from "../db.js";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  // 1. Obtener el token del header 'Authorization'
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No autorizado, falta el token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // 2. Validar el token con Supabase
    const {
      data: { user },
      error,
    } = await supabaseAuth.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: "Token inválido o expirado" });
    }

    // 3. Inyectar el usuario en la petición para usarlo luego
    req.user = user;
    next();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error al verificar el token de sesión";
    console.error("Error en autenticación:", errorMessage);
    return res.status(500).json({ error: "Error al procesar la autenticación" });
  }
}
