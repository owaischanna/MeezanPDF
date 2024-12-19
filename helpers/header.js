const addPDFHeader = (doc) => {
    const leftMargin = 50; // Adjusted margin to move text more to the left
  
    // Register fonts
    doc.registerFont('Arial', 'C:/Windows/Fonts/Arial.ttf');
    doc.registerFont('TimesNewRoman', 'C:/Windows/Fonts/times.ttf');
    doc.registerFont('JaneCapsLight', 'path/to/JaneCapsLight.ttf');
  
    // Format the date to the required format (DD/MM/YYYY AT HH:mm:ssAM/PM)
    const formattedDate = new Date().toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    }).replace(',', ''); // Replace comma with empty string
  
    // Add the print date in the top-right corner (single line)
    doc
      .font('Arial')  // Ensure Arial is used for this text (without bold)
      .fontSize(6)
      .text(`Produced On: ${formattedDate}`,
        470, // Adjusted position for better alignment
        20,
        { 
          width: 120, // Maximum width for the text block
          align: "right", // Aligns text to the right within the text block
        }
      );
  
    // Add the bank name (slightly reduced font size and moved up/left)
    doc
      .font("TimesNewRoman")
      .fontSize(22) 
      .text("Bank AL Habib Limited", leftMargin, 15, { align: "left" });
  
    // Add the first line of text
    doc
      .font("Arial")
      .fontSize(7)
      .text("ALLAMA IQBAL TOWN LHR - 0029", leftMargin, 40, { align: "left" });
  
    // Add the second line of text
    doc
      .text(
        "7, CHENAB BL. MAIN BOULEVARD, ALLAMA IQBAL TOWN, LHR, PAKISTAN LAHORE",
        leftMargin,
        50,
        { align: "left" }
      );
  
    doc.moveDown(); // Adds a gap below the header
  };
  
  module.exports = { addPDFHeader };
  