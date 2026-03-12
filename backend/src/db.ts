import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";

// Cargar variables de entorno
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Validación de seguridad
if (!supabaseUrl || !supabaseServiceKey) {
	throw new Error(
		"Faltan las variables de entorno SUPABASE_URL o SUPABASE_ANON_KEY",
	);
}

// Crear el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false,
	},
});
