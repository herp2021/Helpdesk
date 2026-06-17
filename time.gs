/**
 * Handles MANUAL entries in Column B.
 * Timestamps Column C and adds the formula to Column D.
 * Safeguards historical data by preventing modifications on older rows.
 */
function onEdit(e) {
  const sheetName = "Data";
  const sheet = e.source.getActiveSheet();
  const range = e.range;

  // 1. Ensure the edit is on the correct sheet, row > 1, and exactly Column B (Column 2)
  if (sheet.getName() === sheetName && range.getColumn() === 2 && range.getRow() > 1) {
    
    const row = range.getRow();
    const cellValue = range.getValue();
    
    const timestampCell = sheet.getRange(row, 3); // Column C
    const formulaCell = sheet.getRange(row, 4);   // Column D
    
    const existingTimestamp = timestampCell.getValue();

    // 2. If a value was manually typed into Column B
    if (cellValue !== "") {
      // ONLY add timestamp if Column C is currently empty (never overwrite old data)
      if (existingTimestamp === "") {
        timestampCell.setValue(new Date());
        formulaCell.setFormula('=IF(C' + row + '="","",INT(C' + row + '))');
      }
    } 
    // 3. Clean up: If the user deletes the value in Column B
    else {
      // Check if there is an existing timestamp to evaluate
      if (existingTimestamp instanceof Date) {
        
        // Get today's date and the timestamp's date (ignoring hours/minutes)
        const today = new Date().setHours(0,0,0,0);
        const timestampDate = new Date(existingTimestamp).setHours(0,0,0,0);
        
        // ONLY clear if the timestamp was made TODAY
        if (today === timestampDate) {
          timestampCell.clearContent();
          formulaCell.clearContent();
        } else {
          // OPTIONAL: If it's an old row, put the old value back or alert the user.
          // Since the user deleted it, you might want to leave B empty but preserve C & D, 
          // or alert them. For now, it simply protects C and D from being deleted.
          SpreadsheetApp.getUi().alert("Warning: You cleared a row from a previous day. Column C and D tracking data have been preserved.");
        }
      }
    }
  }
}
