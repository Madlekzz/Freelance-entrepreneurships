import { Outlet, useLocation } from "react-router-dom";
import DashboardLayout from "../components/layout/DashboardLayout";
import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
import { useDashboard } from "../hooks/useDashboard";

export default function DashboardPage() {
  const {
    activeTab,
    user,
    roles,
    navConfig,
    MENU_ITEMS,
    handleNavigation,
    loading,
  } = useDashboard();

  const location = useLocation();

  const isDetailView = location.pathname.includes("/entrepreneurships/");

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DashboardLayout
      sidebar={
        <Sidebar
          roles={roles} // El array: ["IT", "ADMIN"]
          navConfig={navConfig}
          activeId={activeTab}
          onNavigate={handleNavigation}
          user={user}
        />
      }
      topbar={
        !isDetailView && (
          <Topbar
            title={
              MENU_ITEMS.find((i) => i.id === activeTab)?.label || "Dashboard"
            }
            subtitle="Bienvenido al panel de gestión"
          />
        )
      }
    >
      <Outlet />
    </DashboardLayout>
  );
}
