/**
 * Monitors the "Data" sheet for "Solved" status in Column J.
 * Sends an email to the store and marks it as notified in Column Z.
 * * * * OFFICE HOURS LOGIC:
 * This script will only send emails between 10:00 AM and 7:00 PM.
 * * * * SETUP INSTRUCTIONS:
 * 1. RUN 'markExistingAsSent' ONCE to prevent old rows from sending emails.
 * 2. Go to Triggers (Clock icon on the left).
 * 3. Add a new trigger for 'checkStatusAndNotify'.
 * 4. Set it to 'Time-driven' -> 'Minutes timer' -> 'Every 30 minutes'.
 */
function checkStatusAndNotify() {
  // --- OFFICE HOURS CHECK ---
  const now = new Date();
  const currentHour = now.getHours();
  
  // Define office hours (10 corresponds to 10 AM, 19 corresponds to 7 PM)
  const startHour = 10;
  const endHour = 19;

  // If the trigger runs outside these hours, it exits immediately
  if (currentHour < startHour || currentHour >= endHour) {
    console.log("Outside of office hours (" + currentHour + ":00). Skipping status check.");
    return;
  }

  const spreadsheetId = "1oHeb_Vm2MyGo3h-pkRW9eTnd7IvgHlnmCctb-gJdPoI";
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const dataSheet = ss.getSheetByName("Data");
  
  if (!dataSheet) {
    console.error("Sheet 'Data' not found.");
    return;
  }

  // Settings
  const statusColumn = 10;    // Column J
  const storeColumn = 2;     // Column B
  const issueColumn = 7;     // Column G
  const notifiedColumn = 26; // Column Z

  // Email Map
  const storeEmailMap = {
    "Rashbehari": "RASHBEHARI@[MASKED]",
    "Bowbazaar": "bowbazar@[MASKED]",
    "BB2": "bowbazar2@[MASKED]",
    "Baghajatin": "baghajatin@[MASKED]",
    "Tobin Road": "tobinroad@[MASKED]",
    "Behala": "behala@[MASKED]",
    "Sodepur BT Road": "sodepur_btroad@[MASKED]",
    "Gariahat": "gariahat@[MASKED]",
    "Batanagar": "batanagar@[MASKED]",
    "Garia": "garia@[MASKED]",
    "Sodepur Stn Rd": "sodepur@[MASKED]",
    "Nagerbazar": "nagerbazar@[MASKED]",
    "Birati": "birati@[MASKED]",
    "Silpara": "silpara@[MASKED]",
    "Haridevpur": "haridebpur@[MASKED]",
    "Ambuja": "hba@[MASKED]",
    "Baruipur": "baruipur@[MASKED]",
    "Jodhpur Park": "hjd@[MASKED]",
    "Kamalgazi": "kamalgazi@[MASKED]",
    "Santoshpur": "santoshpur@[MASKED]",
    "Kalikapur": "kalikapur@[MASKED]",
    "Tollygunge": "tollygunge@[MASKED]",
    "Barrackpore": "barrackpore@[MASKED]",
    "Asansol": "asansol@[MASKED]",
    "Berhampore": "berhampore@[MASKED]",
    "Haldia": "haldia@[MASKED]",
    "Purulia": "purulia@[MASKED]",
    "Midnapore": "midnapore@[MASKED]",
    "Suri": "suri@[MASKED]",
    "Ram Raja Tala": "ramrajatala@[MASKED]",
    "Kharagpur": "kharagpur@[MASKED]",
    "Arambagh": "arambagh@[MASKED]",
    "GT Road Burdwan": "burdwan2@[MASKED]",
    "Durgapur Mall": "durgapur@[MASKED]",
    "Chinsurah": "chinsurah@[MASKED]",
    "Kanchrapara": "kanchrapara@[MASKED]",
    "Krishnanagar": "krishnanagar@[MASKED]",
    "Serampore": "sreerampur@[MASKED]",
    "Chandannagar": "chandannagar@[MASKED]",
    "Uttarpara": "uttarpara@[MASKED]",
    "Ranaghat": "ranaghat@[MASKED]"
  };

  const lastRow = dataSheet.getLastRow();
  if (lastRow < 2) return; 

  // FIXED: Using getDataRange().getValues() reads the direct raw database values, 
  // bypassing active slicers, filters, or hidden UI rows entirely.
  const fullDataRange = dataSheet.getRange(2, 1, lastRow - 1, notifiedColumn);
  const values = fullDataRange.getValues();

  values.forEach((row, index) => {
    const actualRowIndex = index + 2;
    const storeName = row[storeColumn - 1];
    const status = row[statusColumn - 1];
    const issueDescription = row[issueColumn - 1];
    const alreadyNotified = row[notifiedColumn - 1];

    if (status && status.toString().trim().toLowerCase() === "solved" && !alreadyNotified) {
      const email = storeEmailMap[storeName];

      if (email && email.includes("@")) {
        try {
          MailApp.sendEmail({
            to: email,
            cc: "[MASKED]",
            subject: "Update: Your Issue has been Solved - " + storeName,
            body: "Hello " + storeName + " Team,\n\n" +
                  "We are pleased to inform you that your reported issue has been marked as SOLVED.\n\n" +
                  "--- ISSUE DETAILS ---\n" +
                  "Description: " + issueDescription + "\n" +
                  "Status: Solved\n\n" +
                  "If you require further assistance regarding this matter, please feel free to contact us.\n\n" +
                  "Thanks & Regards\n" +
                  "Team ERP\n" +
                  "033 4041 5091 | 033 4530 4358 | 033 4041 5066"
          });

          // Mark as notified in Column Z
          dataSheet.getRange(actualRowIndex, notifiedColumn).setValue("SENT");
          console.log("Email sent to " + storeName + " for row " + actualRowIndex);
          
          // Force immediate save to prevent background thread conflicts
          SpreadsheetApp.flush();
        } catch (err) {
          console.error("Failed to send email for row " + actualRowIndex + ": " + err);
        }
      }
    }
  });
}

/**
 * RUN THIS ONCE: Marks all current "Solved" rows as "SENT" in Column Z 
 */
function markExistingAsSent() {
  const spreadsheetId = "1oHeb_Vm2MyGo3h-pkRW9eTnd7IvgHlnmCctb-gJdPoI";
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const dataSheet = ss.getSheetByName("Data");
  const lastRow = dataSheet.getLastRow();
  const statusColumn = 10; // J
  const notifiedColumn = 26; // Z

  const statuses = dataSheet.getRange(2, statusColumn, lastRow - 1, 1).getValues();
  const notifiedValues = [];

  for (let i = 0; i < statuses.length; i++) {
    if (statuses[i][0].toString().toLowerCase() === "solved") {
      notifiedValues.push(["SENT"]);
    } else {
      notifiedValues.push([""]);
    }
  }

  dataSheet.getRange(2, notifiedColumn, notifiedValues.length, 1).setValues(notifiedValues);
  SpreadsheetApp.flush();
  console.log("All existing Solved rows marked as SENT in Column Z.");
}
