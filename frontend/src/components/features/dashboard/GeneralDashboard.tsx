import AdminSection from "./AdminSection";
import ConsumerSection from "./ConsumerSection";
import DashboardFooter from "./DashboardFooter";
import { useGeneralStats } from "./hooks/useGeneralStats";
import ITSection from "./ITSection";
import LoadingSkeleton from "./LoadingSkeleton";
import ProviderSection from "./ProviderSection";
import WelcomeHeader from "./WelcomeHeader";

export default function GeneralDashboard() {
  const {
    user,
    roles,
    canSeeAdmin,
    canSeeIT,
    isProvider,
    isConsumer,
    stats,
    itData,
    rolesList,
    loading,
  } = useGeneralStats();

  if (loading) return <LoadingSkeleton />;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <WelcomeHeader user={user} roles={roles} />

      {canSeeAdmin && <AdminSection stats={stats.adminStats} />}

      {canSeeIT && <ITSection data={itData} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {isProvider && <ProviderSection stats={stats.providerStats} />}
        {isConsumer && <ConsumerSection stats={stats.consumerStats} />}
      </div>

      <DashboardFooter rolesList={rolesList} />
    </div>
  );
}
