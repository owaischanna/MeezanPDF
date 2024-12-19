const xlsx = require('xlsx');

const readExcelFile = (filePath, sheetIndex = 0) => {
  try {
    // Read the workbook
    const workbook = xlsx.readFile(filePath);
    
    // Get the sheet name by index
    const sheetName = workbook.SheetNames[sheetIndex];
    if (!sheetName) {
      throw new Error("Sheet index is out of bounds");
    }

    // Convert sheet data to JSON with header as the first row
    const sheetData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });

    // Initialize arrays and objects to store parsed data
    const transactions = [];
    const accountInfo = {};

    // Iterate through rows in the sheet
    sheetData.forEach(row => {
      const label = row[0] && row[0].toString().trim(); // Ensure it's a string and clean up label
      const value = row[1];

      // Check if the row is for account info (object data)
      if (label && value !== undefined && value !== null) {
        if (label.includes("Account Title") || label.includes("Account No") || label.includes("Currency") || label.includes("From Date") || label.includes("To Date")) {
          // Process account-related data (Object data)
          const formattedValue = (typeof value === 'string') ? value.trim() : value;
          const key = label.replace(/:/g, '').trim();  // Remove colon from label
          accountInfo[key] = formattedValue;  // Add to the result object
        }
      }

      // Check if the row is a transaction (array data)
      if (row.length >= 5) {
        const transaction = {
          "Transaction Date": row[0],  // Assuming Transaction Date is in column 1
          "Description": row[1],       // Assuming Description is in column 2
          "Debit": row[2],             // Assuming Debit is in column 3
          "Credit": row[3],            // Assuming Credit is in column 4
          "Available Balance": row[4]  // Assuming Available Balance is in column 5
        };
        transactions.push(transaction); // Add to transactions array
      }
    });

    // Return both transactions and accountInfo
    return { transactions, accountInfo };
  } catch (error) {
    console.error("Error reading Excel file:", error);
    throw new Error("Error reading Excel file: " + error.message);
  }
};

module.exports = { readExcelFile };
