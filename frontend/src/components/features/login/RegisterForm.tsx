import { Select } from "antd";
import { Loader2 } from "lucide-react";
import { AVAILABLE_ROLES } from "../../../constants";
import { useRegister } from "./hooks/useRegister";
import RegisterSuccess from "./RegisterSuccess";

export default function RegisterForm() {
  const { form, loading, error, success, updateField, handleRegister } =
    useRegister();

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-primary transition-colors placeholder:text-gray-300 disabled:bg-gray-50";

  if (success) return <RegisterSuccess />;

  return (
    <form onSubmit={handleRegister} noValidate className="flex flex-col gap-5">
      <div>
        <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">
          Solicitar acceso
        </h2>
        <p className="text-sm text-gray-400">
          IT revisará tu solicitud antes de activar la cuenta
        </p>
      </div>

      <div className="flex flex-col gap-3.5">
        {/* Nombre */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-600 mb-1.5"
          >
            Nombre completo
          </label>
          <input
            id="name"
            type="text"
            placeholder="Tu nombre completo"
            value={form.user_name}
            onChange={(e) => updateField("user_name")(e.target.value)}
            disabled={loading}
            required
            className={inputClass}
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600 mb-1.5"
          >
            Correo electrónico
          </label>
          <input
            id="email"
            type="email"
            placeholder="tu@email.com"
            value={form.email}
            onChange={(e) => updateField("email")(e.target.value)}
            disabled={loading}
            required
            className={inputClass}
          />
          <p className="text-[10px] text-gray-400 mt-1 italic">
            * Asegurate de utilizar tu correo de slack para poder recibir
            notificaciones.
          </p>
        </div>

        {/* Emprendimiento */}
        <div>
          <label
            htmlFor="entrepreneurship-name"
            className="block text-sm font-medium text-gray-600 mb-1.5"
          >
            Nombre del Emprendimiento (opcional)
          </label>
          <input
            id="entrepreneurship-name"
            type="text"
            placeholder="El nombre de tu emprendimiento"
            value={form.entrepreneurship_name}
            onChange={(e) =>
              updateField("entrepreneurship_name")(e.target.value)
            }
            disabled={loading}
            className={inputClass}
          />
        </div>

        {/* Roles */}
        <div>
          <label
            htmlFor="roles"
            className="block text-sm font-medium text-gray-600 mb-1.5"
          >
            Roles solicitados
          </label>
          <Select
            id="roles"
            mode="multiple"
            allowClear
            placeholder="Selecciona tus roles"
            value={form.role}
            onChange={(values) => updateField("role")(values)}
            options={AVAILABLE_ROLES}
            disabled={loading}
            maxTagCount="responsive"
            className="w-full"
            style={{ height: "46px" }}
          />
          <p className="text-[10px] text-gray-400 mt-1 italic">
            * Puedes seleccionar más de un rol si es necesario.
          </p>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 cursor-pointer bg-primary hover:bg-primary-dark disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
      >
        {loading && <Loader2 size={16} className="animate-spin" />}
        {loading ? "Enviando..." : "Enviar solicitud"}
      </button>
    </form>
  );
}
