const generateTableFromExcelData = (
  doc,
  data,
  headers = ["Transaction Date", "Description", "Debit", "Credit", "Available Balance"],
  columnWidths = [],
  leftMargin = 48,
  firstPageTopMargin = 200,
  subsequentPageTopMargin = 50,
  defaultRowHeight = 30,
  footerHeight = 30
) => {
  if (!Array.isArray(data)) throw new Error("Data is not an array. Ensure data is parsed correctly.");

  // Register fonts
  doc.registerFont("CourierNew", "./Fonts/cour.ttf");
  doc.registerFont("CourierNewBold", "./Fonts/courbd.ttf");

  const pageWidth = doc.page.width;
  const pageMargin = 50;
  const usableWidth = pageWidth - pageMargin * 2;

  const defaultColumnWidths = [1, 3, 0.8, 0.8, 1];
  columnWidths =
    columnWidths.length > 0
      ? columnWidths
      : defaultColumnWidths.map((ratio) => (ratio / defaultColumnWidths.reduce((a, b) => a + b)) * usableWidth);

  let currentY = firstPageTopMargin;
  let currentPage = 1;
  let headerDrawn = false; // Track if the header is already drawn

  // Validate and sanitize data
  const validateData = (data) => {
    return data.filter(
      (row) => !(row["Transaction Date"] === "Transaction Date" || row["Description"] === "Description")
    );
  };

  const sanitizedData = validateData(data);

  const formatDate = (date) => {
    if (!date) return "";

    if (typeof date === "number" && !isNaN(date)) {
      const serialDate = new Date(1900, 0, date - 1);
      return formatSerialDate(serialDate);
    }

    const dateString = date.toString().trim();

    if (dateString.match(/^\d{1,2}\/\d{1,2}\/\d{4}$/)) {
      const parts = dateString.split("/");
      const month = parts[0].padStart(2, "0");
      const day = parts[1].padStart(2, "0");
      const year = parts[2];
      return `${day}/${month}/${year}`;
    }

    const parsedDate = new Date(dateString);
    if (!isNaN(parsedDate)) {
      return formatSerialDate(parsedDate);
    }

    return dateString;
  };

  const formatSerialDate = (date) => {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    return `${day}/${month}/${year}`;
  };

  const formatNumber = (value) =>
    value && !isNaN(value)
      ? parseFloat(value).toLocaleString("en-US", { minimumFractionDigits: 2 })
      : "";

      const drawHeader = () => {
        if (headerDrawn) return; // Skip drawing header if already drawn
      
        doc.moveTo(leftMargin, currentY)
          .lineTo(leftMargin + columnWidths.reduce((a, b) => a + b), currentY)
          .stroke();
      
        let x = leftMargin;
        headers.forEach((header, i) => {
          let align = "left";
          
          // Center the "Description" header
          if (header === "Description") {
            align = "center";
          } else if (["Transaction Date", "Debit", "Credit", "Available Balance"].includes(header)) {
            align = "center";
          }
      
          doc.font("CourierNewBold").fontSize(10).text(header, x + 5, currentY + 5, {
            width: columnWidths[i] - 10,
            align,
          });
      
          doc.moveTo(x, currentY).lineTo(x, currentY + defaultRowHeight).stroke();
          x += columnWidths[i];
        });
      
        doc.moveTo(leftMargin + columnWidths.reduce((a, b) => a + b), currentY)
          .lineTo(leftMargin + columnWidths.reduce((a, b) => a + b), currentY + defaultRowHeight)
          .stroke();
      
        doc.moveTo(leftMargin, currentY + defaultRowHeight)
          .lineTo(leftMargin + columnWidths.reduce((a, b) => a + b), currentY + defaultRowHeight)
          .stroke();
      
        currentY += defaultRowHeight;
        headerDrawn = true; // Mark header as drawn
      };
  const addPageBreak = () => {
    // drawFooter();
    doc.addPage();
    currentPage++;
    currentY = subsequentPageTopMargin;
  };

  const drawFooter = () => {
    doc.font("CourierNew").fontSize(9.5).text(`Page ${currentPage}`, doc.page.width - 50, doc.page.height - 30, {
      align: "right",
    });
  };

  const drawRows = () => {
    sanitizedData.forEach((row) => {
      if (currentY + defaultRowHeight + footerHeight > doc.page.height) {
        addPageBreak();
      }

      let x = leftMargin;
      let rowHeight = defaultRowHeight;

      doc.moveTo(leftMargin, currentY)
        .lineTo(leftMargin + columnWidths.reduce((a, b) => a + b), currentY)
        .stroke();

      headers.forEach((header, i) => {
        let value = row[header] || "";
        const align =
          header === "Transaction Date"
            ? "center"
            : header === "Description"
            ? "left"
            : "right";

        if (header === "Transaction Date") value = formatDate(value);
        if (["Debit", "Credit", "Available Balance"].includes(header)) value = formatNumber(value);

        const options = { width: columnWidths[i] - 10, align, lineBreak: true };
        const textHeight = doc.heightOfString(value, options);

        rowHeight = Math.max(rowHeight, textHeight + 5);

        doc.font("CourierNew").fontSize(9.5).text(value, x + 5, currentY + 5, options);

        doc.moveTo(x, currentY).lineTo(x, currentY + rowHeight).stroke();
        x += columnWidths[i];
      });

      doc.moveTo(leftMargin + columnWidths.reduce((a, b) => a + b), currentY)
        .lineTo(leftMargin + columnWidths.reduce((a, b) => a + b), currentY + rowHeight)
        .stroke();

      doc.moveTo(leftMargin, currentY + rowHeight)
        .lineTo(leftMargin + columnWidths.reduce((a, b) => a + b), currentY + rowHeight)
        .stroke();

      currentY += rowHeight;
    });
  };

  drawHeader(); // Draw header on the first page only
  drawRows();
  // drawFooter();
};

module.exports = { generateTableFromExcelData };
