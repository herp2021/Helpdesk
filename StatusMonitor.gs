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
    "Store A": "store_a@[MASKED]",
    "Store B": "store_b@[MASKED]",
    "Store C": "store_c@[MASKED]",
    "Store D": "store_d@[MASKED]",
    "Store E": "store_e@[MASKED]",
    "Store F": "store_f@[MASKED]",
    "Store G": "store_g@[MASKED]",
    "Store H": "store_h@[MASKED]",
    "Store I": "store_i@[MASKED]",
    "Store J": "store_j@[MASKED]",
    "Store K": "store_k@[MASKED]",
    "Store L": "store_l@[MASKED]",
    "Store M": "store_m@[MASKED]",
    "Store N": "store_n@[MASKED]",
    "Store O": "store_o@[MASKED]",
    "Store P": "store_p@[MASKED]",
    "Store Q": "store_q@[MASKED]",
    "Store R": "store_r@[MASKED]",
    "Store S": "store_s@[MASKED]",
    "Store T": "store_t@[MASKED]",
    "Store U": "store_u@[MASKED]",
    "Store V": "store_v@[MASKED]",
    "Store W": "store_w@[MASKED]",
    "Store X": "store_x@[MASKED]",
    "Store Y": "store_y@[MASKED]",
    "Store Z": "store_z@[MASKED]",
    "Store AA": "store_aa@[MASKED]",
    "Store AB": "store_ab@[MASKED]",
    "Store AC": "store_ac@[MASKED]",
    "Store AD": "store_ad@[MASKED]",
    "Store AE": "store_ae@[MASKED]",
    "Store AF": "store_af@[MASKED]",
    "Store AG": "store_ag@[MASKED]",
    "Store AH": "store_ah@[MASKED]",
    "Store AI": "store_ai@[MASKED]",
    "Store AJ": "store_aj@[MASKED]",
    "Store AK": "store_ak@[MASKED]",
    "Store AL": "store_al@[MASKED]",
    "Store AM": "store_am@[MASKED]",
    "Store AN": "store_an@[MASKED]"
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
                  "[PHONE MASKED] | [PHONE MASKED] | [PHONE MASKED]"
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
