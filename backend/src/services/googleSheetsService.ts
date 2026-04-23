import { sheets_v4 } from "@googleapis/sheets";
import { JWT } from "google-auth-library";
import { spreadsheetId } from "./googleSheetsConfig.js";

const auth = new JWT({
  email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "",
  key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = new sheets_v4.Sheets({ auth });

const TOTAL_COLUMN = "TOTAL";
const SHEET_NAME = "CREDITOS MARZO 1";
const NAME_COLUMN_INDEX = 1;
const EMAIL_COLUMN_INDEX = 2;
const PAYMENT_SHEET_NAME = "PAGO 02/30";
const PAYMENT_NAME_COLUMN_INDEX = 1;
const PAYMENT_EMAIL_COLUMN_INDEX = 2;
const PAYMENT_EMPRENDIMIENTO_COLUMN_INDEX = 9;

function getColumnLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

// FUNCIONES PARA CALCULOS DE CONSUMIDORES

export async function findFreelancerRow(
  consumerName: string,
  consumerEmail: string,
): Promise<number | null> {
  const emailMatches = await findInColumn(EMAIL_COLUMN_INDEX, consumerEmail);
  if (emailMatches !== null) return emailMatches;

  const nameMatches = await findInColumn(NAME_COLUMN_INDEX, consumerName);
  return nameMatches;
}

async function findInColumn(
  columnIndex: number,
  searchValue: string,
): Promise<number | null> {
  const columnLetter = getColumnLetter(columnIndex);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `${SHEET_NAME}!${columnLetter}:${columnLetter}`,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return null;
  }

  const searchLower = searchValue.toLowerCase().trim();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;
    const cellValue = row[0].toString().toLowerCase().trim();

    if (cellValue === searchLower) {
      return i + 1;
    }
  }

  return null;
}

export async function updateEntrepreneurshipSpent(
  rowNumber: number,
  columnName: string,
  amount: number,
): Promise<void> {
  const metadataResponse = await sheets.spreadsheets.get({
    spreadsheetId: spreadsheetId,
    ranges: [`${SHEET_NAME}!1:1`],
    includeGridData: true,
  });

  const sheet = metadataResponse.data.sheets?.find(
    (s) => s.properties?.title === SHEET_NAME,
  );
  const gridProperties = sheet?.properties?.gridProperties;
  const maxCols = gridProperties?.columnCount || 11;

  const headersResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `${SHEET_NAME}!1:1`,
  });

  const headers = headersResponse.data.values?.[0] || [];
  const totalColumnIndex = headers.findIndex(
    (h: string) => h.toLowerCase().trim() === TOTAL_COLUMN.toLowerCase(),
  );

  let targetColumnIndex: number;

  if (totalColumnIndex !== -1) {
    const existingColumnIndex = headers.findIndex(
      (h: string) => h.toLowerCase().trim() === columnName.toLowerCase().trim(),
    );

    if (existingColumnIndex !== -1 && existingColumnIndex < totalColumnIndex) {
      targetColumnIndex = existingColumnIndex;
    } else {
      const sheetId = sheet?.properties?.sheetId as number;

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        requestBody: {
          requests: [
            {
              insertDimension: {
                range: {
                  sheetId: sheetId,
                  dimension: "COLUMNS",
                  startIndex: totalColumnIndex,
                  endIndex: totalColumnIndex + 1,
                },
              },
            },
          ],
        },
      });

      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        requestBody: {
          requests: [
            {
              updateCells: {
                rows: [
                  {
                    values: [{ userEnteredValue: { stringValue: columnName } }],
                  },
                ],
                fields: "userEnteredValue",
                start: {
                  sheetId: sheetId,
                  rowIndex: 0,
                  columnIndex: totalColumnIndex,
                },
              },
            },
            {
              updateCells: {
                rows: [
                  { values: [{ userEnteredValue: { numberValue: amount } }] },
                ],
                fields: "userEnteredValue",
                start: {
                  sheetId: sheetId,
                  rowIndex: rowNumber - 1,
                  columnIndex: totalColumnIndex,
                },
              },
            },
          ],
        },
      });

      return;
    }
  } else {
    targetColumnIndex = headers.length;
    if (targetColumnIndex >= maxCols) {
      const sheetId = sheet?.properties?.sheetId as number;
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: spreadsheetId,
        requestBody: {
          requests: [
            {
              insertDimension: {
                range: {
                  sheetId: sheetId,
                  dimension: "COLUMNS",
                  startIndex: maxCols - 1,
                  endIndex: maxCols,
                },
              },
            },
          ],
        },
      });
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId,
      range: `${SHEET_NAME}!${getColumnLetter(targetColumnIndex)}1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[columnName]],
      },
    });
  }

  const columnLetter = getColumnLetter(targetColumnIndex);
  const cellRef = `${SHEET_NAME}!${columnLetter}${rowNumber}`;

  const currentValueResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: cellRef,
  });

  const currentValue = parseFloat(
    currentValueResponse.data.values?.[0]?.[0]?.replace(/[$,]/g, "") || "0",
  );
  const newValue = currentValue + amount;

  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId,
    range: cellRef,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[newValue]],
    },
  });
}

// FUNCIONES PARA CALCULOS DE EMPRENDIMIENTOS

export async function findEntrepreneurRow(
  entrepreneurName: string,
  entrepreneurEmail?: string,
): Promise<number | null> {
  const nameMatches = await findPaymentInColumn(
    PAYMENT_NAME_COLUMN_INDEX,
    entrepreneurName,
  );
  if (nameMatches !== null) return nameMatches;

  if (entrepreneurEmail) {
    const emailMatches = await findPaymentInColumn(
      PAYMENT_EMAIL_COLUMN_INDEX,
      entrepreneurEmail,
    );
    if (emailMatches !== null) return emailMatches;
  }

  return null;
}

async function findPaymentInColumn(
  columnIndex: number,
  searchValue: string,
): Promise<number | null> {
  const columnLetter = getColumnLetter(columnIndex);
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `${PAYMENT_SHEET_NAME}!${columnLetter}:${columnLetter}`,
  });

  const rows = response.data.values;
  if (!rows || rows.length === 0) {
    return null;
  }

  const searchLower = searchValue.toLowerCase().trim();

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;
    const cellValue = row[0].toString().toLowerCase().trim();

    if (cellValue === searchLower) {
      return i + 1;
    }
  }

  return null;
}

export async function updateEntrepreneurEarnings(
  entrepreneurName: string,
  entrepreneurEmail: string,
  amount: number,
): Promise<void> {
  const rowNumber = await findEntrepreneurRow(
    entrepreneurName,
    entrepreneurEmail,
  );
  if (rowNumber === null) {
    console.warn(
      `Emprendedor ${entrepreneurName} no encontrado en ${PAYMENT_SHEET_NAME}`,
    );
    return;
  }

  const columnLetter = getColumnLetter(PAYMENT_EMPRENDIMIENTO_COLUMN_INDEX);
  const cellRef = `${PAYMENT_SHEET_NAME}!${columnLetter}${rowNumber}`;

  const currentValueResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: cellRef,
  });

  const currentValue = parseFloat(
    currentValueResponse.data.values?.[0]?.[0]?.replace(/[$,]/g, "") || "0",
  );
  const newValue = currentValue + amount;

  await sheets.spreadsheets.values.update({
    spreadsheetId: spreadsheetId,
    range: cellRef,
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[newValue]],
    },
  });
}
