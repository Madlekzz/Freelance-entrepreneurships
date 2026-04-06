import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import EntrepreneurshipLayout from "./components/layout/EntrepreneurshipLayout";
import AdminConsumers from "./components/ui/modules/admin-consumers/AdminConsumers";
import AdminEntrepreneurs from "./components/ui/modules/admin-entrepreneurs/AdminEntrepreneurs";
import GeneralDashboard from "./components/ui/modules/dashboard/GeneralDashboard";
// Módulos
import EntrepreneurshipOverview from "./components/ui/modules/my-entrepreneurships/EntrepreneurshipOverview";
import MyEntrepreneurships from "./components/ui/modules/my-entrepreneurships/MyEntrepreneurships";
import MyProducts from "./components/ui/modules/my-entrepreneurships/products/MyProducts";
import MySales from "./components/ui/modules/my-entrepreneurships/sales/MySales";
import MyPurchases from "./components/ui/modules/my-purchases/MyPurchases";
import SignupRequests from "./components/ui/modules/signup-requests/SignupRequests";
import SystemUsers from "./components/ui/modules/system-users/SystemUsers";
// Páginas Públicas
import CatalogPage from "./pages/CatalogPage";
// Layouts
import DashboardPage from "./pages/DashboardPage"; // Este actuará como el Layout General
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* ─── RUTAS PÚBLICAS ─── */}
          <Route path="/" element={<CatalogPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* ─── RUTAS PROTEGIDAS ─── */}
          <Route element={<ProtectedRoute />}>
            {/* DashboardPage ahora envuelve a todas las secciones. 
               Dentro de DashboardPage debes usar <Outlet /> para renderizar los hijos.
            */}
            <Route path="/dashboard" element={<DashboardPage />}>
              <Route index element={<GeneralDashboard />} />
              <Route path="requests" element={<SignupRequests />} />
              <Route path="users" element={<SystemUsers />} />
              <Route path="purchases" element={<MyPurchases />} />
              <Route
                path="entrepreneurships"
                element={<MyEntrepreneurships />}
              />
              <Route path="entrepreneurs" element={<AdminEntrepreneurs />} />
              <Route path="consumers" element={<AdminConsumers />} />
            </Route>

            {/* RUTA DINÁMICA: 
               Esta se mantiene "hermana" de DashboardPage o puede ser hija si quieres
               que comparta el mismo Sidebar exacto sin remontarlo.
            */}
            <Route
              path="/dashboard/entrepreneurships/:id"
              element={<EntrepreneurshipLayout />}
            >
              <Route index element={<EntrepreneurshipOverview />} />
              <Route path="products" element={<MyProducts />} />
              <Route path="sales" element={<MySales />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <ToastContainer position="top-right" autoClose={4000} />
    </BrowserRouter>
  );
}

export default App;
