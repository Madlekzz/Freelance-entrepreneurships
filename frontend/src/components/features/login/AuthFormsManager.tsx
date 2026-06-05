import { useState } from "react";
import { useNavigate } from "react-router-dom";
import freelanceLogoColored from "../../../assets/Isotipo Freelance.png";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

type AuthMode = "login" | "register";

export const AuthFormsManager = () => {
  const [mode, setMode] = useState<AuthMode>("login");
  const navigate = useNavigate();

  return (
    <div className="flex-1 bg-white flex items-center justify-center px-8 py-12 md:px-12">
      <div className="w-full max-w-sm">
        {/* Mobile brand */}
        <div className="flex flex-col items-center mb-8 md:hidden">
          <button
            type="button"
            className="cursor-pointer flex flex-col items-center"
            onClick={() => navigate("/")}
          >
            <img
              src={freelanceLogoColored}
              alt="Freelance Latin America"
              className="h-12 w-auto object-contain"
            />
            <div className="text-center">
              <h2 className="font-display font-bold text-xl text-gray-900 leading-tight">
                Freelance
              </h2>
              <p className="text-primary font-semibold text-sm tracking-wide">
                LATIN AMERICA
              </p>
            </div>
          </button>
        </div>

        {/* Mode toggle */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
          {(["login", "register"] as AuthMode[]).map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                mode === m
                  ? "bg-white text-primary shadow-sm"
                  : "text-gray-400 hover:text-primary"
              }`}
            >
              {m === "login" ? "Iniciar sesión" : "Registrarse"}
            </button>
          ))}
        </div>

        {mode === "login" ? <LoginForm /> : <RegisterForm />}
      </div>
    </div>
  );
};
