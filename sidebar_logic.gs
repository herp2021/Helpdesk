/**
 * Adds a custom menu to open the sidebar.
 * Includes a dynamic count of unassigned pending orders in the menu title.
 */
function onOpen() {
  updateCustomMenu();
}

/**
 * Creates or updates the custom menu with the current unassigned count.
 * To prevent multiple menus, we keep the logic simple.
 * Note: If you see two menus, a simple page refresh is usually required 
 * as Apps Script cannot always programmatically remove "orphaned" menus from previous script runs.
 */
function updateCustomMenu() {
  try {
    const ui = SpreadsheetApp.getUi();
    let unassignedCount = 0;
    
    // Get fresh analysis
    const analysis = getSidebarAnalysis();
    unassignedCount = analysis.unassigned.length;

    const menuTitle = unassignedCount > 0 ? `🔴 ERP Tools (${unassignedCount})` : 'ERP Tools';
    
    // Create the menu
    ui.createMenu(menuTitle)
      .addItem('Open Pending Analysis', 'showSidebar')
      .addToUi();
      
    if (unassignedCount > 0) {
      SpreadsheetApp.getActiveSpreadsheet().toast(`Found ${unassignedCount} unassigned pending orders.`, "ERP Update");
    }
  } catch (e) {
    console.warn("Menu update skipped: " + e.message);
  }
}

/**
 * Function intended for trigger use.
 * Since we are removing comments/notes, this now only updates the Menu UI
 * and shows a Toast if the user is currently active in the sheet.
 */
function checkUnassignedAndNotify() {
  const now = new Date();
  const hour = now.getHours();
  
  // Office Hours Check (10 AM to 7 PM)
  if (hour < 10 || hour >= 19) return;

  // We only update the menu count. 
  // Note: Background triggers cannot update the UI for other users, 
  // so this primarily benefits the person who last ran/authorized the script.
  updateCustomMenu();
}

/**
 * Opens the sidebar.
 */
function showSidebar() {
  const html = HtmlService.createHtmlOutputFromFile('sidebar')
    .setTitle('ERP Pending Dashboard')
    .setWidth(300);
  SpreadsheetApp.getUi().showSidebar(html);
}

/**
 * Fetches analysis data for the sidebar.
 */
function getSidebarAnalysis() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const dataSheet = ss.getSheetByName("Data");
  if (!dataSheet) throw new Error("Sheet 'Data' not found.");

  const lastRow = dataSheet.getLastRow();
  if (lastRow < 2) return { counts: {}, unassigned: [] };

  const values = dataSheet.getRange(2, 1, lastRow - 1, 10).getValues(); 
  
  const counts = {};
  const unassigned = [];

  values.forEach((row, index) => {
    const rowNum = index + 2;
    const assignedPerson = row[8] ? row[8].toString().trim() : ""; 
    const status = row[9] ? row[9].toString().trim().toLowerCase() : ""; 

    if (status === "pending") {
      if (assignedPerson === "") {
        unassigned.push(rowNum);
      } else {
        if (!counts[assignedPerson]) {
          counts[assignedPerson] = { count: 0, rows: [] };
        }
        counts[assignedPerson].count++;
        counts[assignedPerson].rows.push(rowNum);
      }
    }
  });

  return {
    counts: counts,
    unassigned: unassigned
  };
}

/**
 * Highlights a specific row by selecting it.
 */
function highlightRow(rowNum) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Data");
  if (!sheet) return;

  ss.setActiveSheet(sheet);
  const range = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn());
  range.activate();
}

/**
 * Highlights all pending rows for a specific person.
 */
function highlightPersonRows(rowNumbers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("Data");
  if (!sheet || !rowNumbers || rowNumbers.length === 0) return;

  ss.setActiveSheet(sheet);
  const lastCol = sheet.getLastColumn();
  const a1Ranges = rowNumbers.map(rowNum => {
    return sheet.getRange(rowNum, 1, 1, lastCol).getA1Notation();
  });

  sheet.getRangeList(a1Ranges).activate();
}
