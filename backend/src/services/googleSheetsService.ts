import {
  getCreditsSheet,
  getPaymentsSheet,
  getSpreadsheetId,
  sheets,
} from "./googleSheetsConfig.js";

export async function getSlackBotTokenFromSheet(): Promise<string | null> {
  const sheetUrl = process.env.SLACK_TOKEN_SHEET_URL;
  if (!sheetUrl) {
    console.error("[GoogleSheets] SLACK_TOKEN_SHEET_URL no configurada");
    return null;
  }

  const match = sheetUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
  const spreadsheetId = match?.[1];
  if (!spreadsheetId) {
    console.error(
      "[GoogleSheets] No se pudo extraer el ID de la hoja desde la URL",
    );
    return null;
  }

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "A2:A2",
    });

    const value = response.data.values?.[0]?.[0];
    if (!value) {
      console.error(
        "[GoogleSheets] Celda A2 vacía en la hoja de configuración de Slack",
      );
      return null;
    }

    if (!value.startsWith("xoxb-")) {
      console.error(
        "[GoogleSheets] El valor en A2 no parece ser un token válido de Slack (debe comenzar con xoxb-)",
      );
      return null;
    }

    return value;
  } catch (err) {
    console.error("[GoogleSheets] Error al leer el token de Slack:", err);
    return null;
  }
}

const TOTAL_COLUMN = "TOTAL";
const NAME_COLUMN_INDEX = 1;
const EMAIL_COLUMN_INDEX = 2;
const PAYMENT_NAME_COLUMN_INDEX = 1;
const PAYMENT_EMAIL_COLUMN_INDEX = 2;
const PAYMENT_EMPRENDIMIENTO_COLUMN_INDEX = 9;

function getColumnLetter(index: number): string {
  return String.fromCharCode(65 + index);
}

function getSheetNames() {
  return {
    creditsSheet: getCreditsSheet(),
    paymentsSheet: getPaymentsSheet(),
  };
}

// FUNCIONES PARA CALCULOS DE CONSUMIDORES

export async function findFreelancerRow(
  consumerName: string,
  consumerEmail: string,
): Promise<number | null> {
  const { creditsSheet } = getSheetNames();
  const spreadsheetId = getSpreadsheetId();

  if (!spreadsheetId || !creditsSheet) return null;

  const emailMatches = await findInColumn(
    creditsSheet,
    EMAIL_COLUMN_INDEX,
    consumerEmail,
  );
  if (emailMatches !== null) return emailMatches;

  const nameMatches = await findInColumn(
    creditsSheet,
    NAME_COLUMN_INDEX,
    consumerName,
  );
  return nameMatches;
}

async function findInColumn(
  sheetName: string,
  columnIndex: number,
  searchValue: string,
): Promise<number | null> {
  const columnLetter = getColumnLetter(columnIndex);
  const spreadsheetId = getSpreadsheetId();

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!${columnLetter}:${columnLetter}`,
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
  } catch (err) {
    console.error("Error finding in column:", err);
  }

  return null;
}

export async function updateEntrepreneurshipSpent(
  rowNumber: number,
  columnName: string,
  amount: number,
): Promise<void> {
  const { creditsSheet } = getSheetNames();
  const spreadsheetId = getSpreadsheetId();

  if (!spreadsheetId || !creditsSheet) return;

  const metadataResponse = await sheets.spreadsheets.get({
    spreadsheetId,
    ranges: [`${creditsSheet}!1:1`],
    includeGridData: true,
  });

  const sheet = metadataResponse.data.sheets?.find(
    (s) => s.properties?.title === creditsSheet,
  );
  const gridProperties = sheet?.properties?.gridProperties;
  const maxCols = gridProperties?.columnCount || 11;

  const headersResponse = await sheets.spreadsheets.values.get({
    spreadsheetId: spreadsheetId,
    range: `${creditsSheet}!1:1`,
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
      range: `${creditsSheet}!${getColumnLetter(targetColumnIndex)}1`,
      valueInputOption: "RAW",
      requestBody: {
        values: [[columnName]],
      },
    });
  }

  const columnLetter = getColumnLetter(targetColumnIndex);
  const cellRef = `${creditsSheet}!${columnLetter}${rowNumber}`;

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
  const { paymentsSheet } = getSheetNames();
  const spreadsheetId = getSpreadsheetId();

  if (!spreadsheetId || !paymentsSheet) return null;

  const nameMatches = await findPaymentInColumn(
    paymentsSheet,
    PAYMENT_NAME_COLUMN_INDEX,
    entrepreneurName,
  );
  if (nameMatches !== null) return nameMatches;

  if (entrepreneurEmail) {
    const emailMatches = await findPaymentInColumn(
      paymentsSheet,
      PAYMENT_EMAIL_COLUMN_INDEX,
      entrepreneurEmail,
    );
    if (emailMatches !== null) return emailMatches;
  }

  return null;
}

async function findPaymentInColumn(
  sheetName: string,
  columnIndex: number,
  searchValue: string,
): Promise<number | null> {
  const columnLetter = getColumnLetter(columnIndex);
  const spreadsheetId = getSpreadsheetId();

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!${columnLetter}:${columnLetter}`,
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
  } catch (err) {
    console.error("Error finding payment in column:", err);
  }

  return null;
}

export async function updateEntrepreneurEarnings(
  entrepreneurName: string,
  entrepreneurEmail: string,
  amount: number,
): Promise<void> {
  const { paymentsSheet } = getSheetNames();
  const spreadsheetId = getSpreadsheetId();

  if (!spreadsheetId || !paymentsSheet) return;

  const rowNumber = await findEntrepreneurRow(
    entrepreneurName,
    entrepreneurEmail,
  );
  if (rowNumber === null) {
    console.warn(
      `Emprendedor ${entrepreneurName} no encontrado en ${paymentsSheet}`,
    );
    return;
  }

  const columnLetter = getColumnLetter(PAYMENT_EMPRENDIMIENTO_COLUMN_INDEX);
  const cellRef = `${paymentsSheet}!${columnLetter}${rowNumber}`;

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
