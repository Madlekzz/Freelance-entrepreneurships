import { JWT } from "google-auth-library";
import { sheets_v4 } from "@googleapis/sheets";

export const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID || "";
const serviceEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "";
const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "";

const auth = new JWT({
  email: serviceEmail,
  key: privateKey,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

export const sheets = new sheets_v4.Sheets({ auth });

export function isGoogleSheetsConfigured(): boolean {
  return !!(spreadsheetId && serviceEmail && privateKey);
}