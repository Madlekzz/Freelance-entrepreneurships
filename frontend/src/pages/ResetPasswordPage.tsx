import { AuthBrandingPanel } from "../components/features/login/AuthBrandingPanel";
import { ResetPasswordForm } from "../components/features/login/ResetPasswordForm";
import { useResetPassword } from "../hooks/useResetPassword";

export default function ResetPasswordPage() {
  const hook = useResetPassword();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-xl min-h-150">
        <AuthBrandingPanel
          subtitle={
            <>
              Activación de cuenta y<br />
              configuración de seguridad
            </>
          }
          statusText="Contraseña encriptada"
        />

        <div className="flex-1 bg-white flex items-center justify-center px-8 py-12 md:px-12">
          <div className="w-full max-w-sm">
            {/* Mobile Logo */}
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center" />
              <span className="font-display font-semibold text-gray-900">
                Freelance <span className="text-primary">LA</span>
              </span>
            </div>

            <ResetPasswordForm hook={hook} />
          </div>
        </div>
      </div>
    </div>
  );
}
