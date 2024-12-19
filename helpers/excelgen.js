const xlsx = require("xlsx");

const readExcelFile = (filePath, sheetIndex = 0) => {
  try {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[sheetIndex];
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    const accountInfo = {}; // For storing metadata
    const transactions = []; // For storing transaction data

    sheetData.forEach((row) => {
      const label = row[0] && row[0].toString().trim(); // First column
      const value = row[1]; // Second column

      // Parse Metadata (Account Info)
      if (label && value !== undefined) {
        if (label.includes("Account Title")) accountInfo["Account Title"] = value;
        if (label.includes("Account Number")) accountInfo["Account Number"] = value;
        if (label.includes("IBAN")) accountInfo["IBAN"] = value;
        if (label.includes("Currency")) accountInfo["Currency"] = value;
        if (label.includes("From Date")) accountInfo["From Date"] = value;
        if (label.includes("To Date")) accountInfo["To Date"] = value;
        if (label.includes("Address")) accountInfo["Address"] = value;
      }

      // Parse Transactions (5-column rows)
      if (row.length >= 5 && row[0]) {
        transactions.push({
          "Transaction Date": row[0],
          "Description": row[1],
          Debit: row[2],
          Credit: row[3],
          "Available Balance": row[4],
        });
      }
    });

    return { accountInfo, transactions };
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw error;
  }
};

module.exports = { readExcelFile };
