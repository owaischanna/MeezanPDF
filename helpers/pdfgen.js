const PDFDocument = require("pdfkit");
const { addPDFHeader } = require("./header");
const { createStatementOfAccount } = require("./statement");
const { generateTableFromExcelData } = require("./TableGen");

const generatePDF = (data, res) => {
  try {
    const doc = new PDFDocument({ size: [1123, 792], margin:50 }); // US Letter size
    doc.pipe(res);
    
    // Statement of account creation


    createStatementOfAccount(doc, data.accountInfo);

    // Generate Transactions Table
    generateTableFromExcelData(doc, data.transactions);


    doc.end();
  } catch (error) {
    throw new Error("Error generating PDF: " + error.message);
  }
};

module.exports = { generatePDF };
