import { supabaseAdmin } from "../db.js";

let configCache: Record<string, string> = {};
let cacheLoaded = false;

export async function loadAppConfig(): Promise<void> {
  if (cacheLoaded) return;

  try {
    const { data, error } = await supabaseAdmin
      .from("app_config")
      .select("key, value");

    if (error) {
      console.error("Error loading app config:", error);
      return;
    }

    for (const item of data || []) {
      configCache[item.key] = item.value;
    }
    cacheLoaded = true;
    console.log("App config loaded:", Object.keys(configCache));
  } catch (err) {
    console.error("Error loading app config:", err);
  }
}

export function getAppConfigValue(key: string): string | undefined {
  return configCache[key];
}

export async function setAppConfigValue(
  key: string,
  value: string,
): Promise<void> {
  configCache[key] = value;
}

export async function clearAppConfigCache(): Promise<void> {
  configCache = {};
  cacheLoaded = false;
}