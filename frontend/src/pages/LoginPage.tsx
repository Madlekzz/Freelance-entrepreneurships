import { AuthBrandingPanel } from "../components/features/login/AuthBrandingPanel";
import { AuthFormsManager } from "../components/features/login/AuthFormsManager";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-xl min-h-150">
        <AuthBrandingPanel
          subtitle={
            <>
              Plataforma interna de gestión
              <br />
              de emprendimientos
            </>
          }
          features={[
            "Catálogo de productos interno",
            "Gestión de emprendimientos",
            "Descuentos por nómina",
          ]}
        />

        <AuthFormsManager />
      </div>
    </div>
  );
}
