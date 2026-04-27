import { FileSpreadsheet, Settings as SettingsIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../login/hooks/useAuth";
import { useSettings } from "./hooks/useSettings";
import { PasswordChangeForm } from "./PasswordChangeForm";
import { SettingsForm } from "./SettingsForm";
import { SettingsHelper } from "./SettingsHelper";
import { SettingsSkeleton } from "./SettingsSkeleton";

export default function Settings() {
  const { hasRole } = useAuth();
  const isAdmin = hasRole(["IT", "ADMIN"]);
  const [activeTab, setActiveTab] = useState("general");

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

  const tabs = [
    {
      key: "general",
      label: "Configuración General",
      icon: SettingsIcon,
      content: <PasswordChangeForm />,
    },
    ...(isAdmin
      ? [
          {
            key: "sheets",
            label: "Hoja de Administración",
            icon: FileSpreadsheet,
            content: (
              <>
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
              </>
            ),
          },
        ]
      : []),
  ];

  if (loading) {
    return <SettingsSkeleton />;
  }

  return (
    <div className="pb-20">
      <div className="flex gap-1 -mb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              type="button"
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`group flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all cursor-pointer rounded-t-xl border-b-2 ${
                isActive
                  ? "bg-white text-primary border-primary shadow-[0_0_12px_rgba(25,106,227,0.3)] relative z-10"
                  : "text-gray-500 hover:text-primary border-transparent hover:border-primary/30 hover:shadow-[0_0_8px_rgba(25,106,227,0.15)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="bg-white rounded-b-2xl shadow-sm">
        {tabs.find((tab) => tab.key === activeTab)?.content}
      </div>
    </div>
  );
}
