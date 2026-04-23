import { useSettings } from "./hooks/useSettings";
import { SettingsForm } from "./SettingsForm";
import { SettingsHelper } from "./SettingsHelper";
import { SettingsSkeleton } from "./SettingsSkeleton";

export default function Settings() {
  const {
    config,
    setConfig,
    saving,
    loading,
    loadingSheets,
    creditsSheetOptions,
    paymentsSheetOptions,
    handleSave,
    openSheetsLink,
  } = useSettings();

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="pb-20">
      <SettingsForm
        config={config}
        setConfig={setConfig}
        saving={saving}
        loadingSheets={loadingSheets}
        creditsSheetOptions={creditsSheetOptions}
        paymentsSheetOptions={paymentsSheetOptions}
        onSave={handleSave}
        onOpenSheetsLink={openSheetsLink}
      />
      <SettingsHelper />
    </div>
  );
}
