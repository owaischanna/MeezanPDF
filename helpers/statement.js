const createStatementOfAccount = (doc, data) => {
    const leftMargin = 60; // Starting point for labels
    const topMargin = 90; // Top margin
    const labelWidth = 80; // Fixed width for labels
    const valueXOffset = 8; // Minimal spacing between label and value
  
    doc.registerFont("Arial", "./Fonts/Arial.ttf");
    doc.registerFont("CourierNew", "./Fonts/cour.ttf");
    doc.registerFont("CourierNewBold", "./Fonts/courbd.ttf");
    // Add Logo
    const logoPath = './images/mezan.png';
    const logoWidth = 40;
    const logoHeight = 40;
    const logoX = (doc.page.width - logoWidth) / 2;
    const logoY = topMargin - 60;
    doc.image(logoPath, logoX, logoY, { width: logoWidth, height: logoHeight });
  
    // Header
    const headerText = "STATEMENT OF ACCOUNT";
    const headerWidth = doc.widthOfString(headerText);
    const headerX = (doc.page.width - headerWidth) / 2;
    doc.fontSize(11).font("Helvetica-Bold").text(headerText, headerX, topMargin);
  
    doc.moveDown();
  
    
    const fields = [
      { label: "Account Title :", value: data["Account Title"] },
      { label: "Account No    :", value: data["Account Number"] },
      { label: "IBAN No       :", value: data["IBAN"] },
      { label: "Currency      :", value: data["Currency"] },
      { label: "From Date     :", value: (data["From Date"]) },
      { label: "To Date       :", value: (data["To Date"]) },
      { label: "Address       :", value: data["Address"] },
    ];
  
    let currentY = topMargin + 30;
    const fieldSpacing = 10; // Space between rows
  
    fields.forEach((field) => {
      // Print Label
      doc.fontSize(9.5).font("CourierNew").text(field.label, leftMargin, currentY);
  
      // Print Value tightly next to the label
      const valueX = leftMargin + labelWidth + valueXOffset; // Align value after label
      doc.font("CourierNew").text(field.value, valueX, currentY);
  
      currentY += fieldSpacing; // Move to next line
    });
  };
  
  module.exports = { createStatementOfAccount };
  



  