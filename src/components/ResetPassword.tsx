import { useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [sessionReady, setSessionReady] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
  const processInvite = async () => {
    // 1. Revisar si hay un hash en la URL
    const hash = window.location.hash;
    console.log("Hash detectado:", hash);

    if (!hash) {
      setMessage("Error: No se encontró el token en la URL.");
      return;
    }

    // 2. Intentar establecer la sesión desde el hash
    const { error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Error al obtener sesión:", error);
      setMessage("Error: Token inválido o expirado.");
    } else {
      // Si llega aquí, la sesión fue validada por el SDK
      setSessionReady(true);
    }
  };

  processInvite();
}, []);

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!sessionReady) {
            setMessage("Error: Sesión no validada. Intenta recargar la página.");
            return;
        }

        setLoading(true);
        setMessage("");

        const { error } = await supabase.auth.updateUser({
            password: password,
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage("¡Contraseña actualizada con éxito! Redirigiendo...");
            setTimeout(() => navigate("/"), 2000);
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Establecer nueva contraseña
                </h2>
                <p className="text-sm text-center text-gray-600">
                    Ingresa tu nueva contraseña para completar el registro.
                </p>

                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Nueva Contraseña
                        </label>
                        <input
                            type="password"
                            required
                            disabled={!sessionReady}
                            className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-primary focus:border-primary"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Mínimo 6 caracteres"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !sessionReady}
                        className="w-full py-2 font-bold cursor-pointer text-white bg-primary rounded-md hover:opacity-90 disabled:bg-gray-400 transition-colors"
                    >
                        {loading ? "Actualizando..." : "Confirmar Contraseña"}
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-sm text-center ${message.includes("Error") ? "text-red-500" : "text-green-600"}`}>
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}