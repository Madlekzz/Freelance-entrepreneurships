import { AuthBrandingPanel } from "../components/features/login/AuthBrandingPanel";
import { ForgotPasswordForm } from "../components/features/login/ForgotPasswordForm";
import { useForgotPassword } from "../hooks/useForgotPassword";

export default function ForgotPasswordPage() {
  const hook = useForgotPassword();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-xl min-h-150">
        {/* Usamos el mismo panel de branding para mantener consistencia visual */}
        <AuthBrandingPanel
          subtitle={
            <>
              Recuperación de acceso y<br />
              seguridad de cuenta
            </>
          }
          statusText="Proceso verificado por IT"
        />

        <div className="flex-1 bg-white flex items-center justify-center px-8 py-12 md:px-12">
          <div className="w-full max-w-sm">
            {/* Logo Mobile */}
            <div className="flex items-center gap-2 mb-8 md:hidden">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center" />
              <span className="font-display font-semibold text-gray-900">
                Freelance <span className="text-primary">LA</span>
              </span>
            </div>

            <ForgotPasswordForm hook={hook} />
          </div>
        </div>
      </div>
    </div>
  );
}
