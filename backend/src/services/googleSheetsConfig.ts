import { sheets_v4 } from "@googleapis/sheets";
import { JWT } from "google-auth-library";
import { getAppConfigValue } from "./appConfigStore.js";

const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";

function createAuth() {
  return new JWT({
    email: serviceEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

export const sheets = new sheets_v4.Sheets({ auth: createAuth() });

export function getSpreadsheetId(): string {
  return getAppConfigValue("spreadsheet_id") || "";
}

export function getCreditsSheet(): string {
  return getAppConfigValue("credits_sheet") || "Creditos";
}

export function getPaymentsSheet(): string {
  return getAppConfigValue("payments_sheet") || "Pagos";
}

export function isGoogleSheetsConfigured(): boolean {
  return !!(serviceEmail && privateKey);
}

export function getSheetsClient(): sheets_v4.Sheets {
  return sheets;
}
