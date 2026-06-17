/**
 * MAIN TRIGGER: Triggered on Form Submission
 */
function onFormSubmit(e) {
  if (!e) {
    console.warn("No event object found.");
    return;
  }

  // --- LATENCY BUFFER ---
  Utilities.sleep(2000);

  // --- SETTINGS ---
  const spreadsheetId = "1oHeb_Vm2MyGo3h-pkRW9eTnd7IvgHlnmCctb-gJdPoI";
  const sheetName = "ERP Helpline"; 
  const ticketColumn = 2; // Column B
  const storeNameColumn = 3; // Column C
  
  const ss = SpreadsheetApp.openById(spreadsheetId);
  const sheet = ss.getSheetByName(sheetName);
  const row = e.range ? e.range.getRow() : sheet.getLastRow();
  
  // --- STORE EMAIL LOOKUP TABLE ---
  const storeEmailMap = {
    "Rashbehari": "RASHBEHARI@himalayaoptical.co",
    "Bowbazaar": "bowbazar@himalayaoptical.co",
    "BB2": "bowbazar2@himalayaoptical.co",
    "Baghajatin": "baghajatin@himalayaoptical.co",
    "Tobin Road": "tobinroad@himalayaoptical.co",
    "Behala": "behala@himalayaoptical.co",
    "Sodepur BT Road": "sodepur_btroad@himalayaoptical.co",
    "Gariahat": "gariahat@himalayaoptical.co",
    "Batanagar": "batanagar@himalayaoptical.co",
    "Garia": "garia@himalayaoptical.co",
    "Sodepur Stn Rd": "sodepur@himalayaoptical.co",
    "NagerBazar": "nagerbazar@himalayaoptical.co",
    "Birati": "birati@himalayaoptical.co",
    "Silpara": "silpara@himalayaoptical.co",
    "Haridevpur": "haridebpur@himalayaoptical.co",
    "Ambuja": "hba@himalayaoptical.co",
    "Baruipur": "baruipur@himalayaoptical.co",
    "Jodhpur Park": "hjd@himalayaoptical.co",
    "Kamalgazi": "kamalgazi@himalayaoptical.co",
    "Santoshpur": "santoshpur@himalayaoptical.co",
    "Kalikapur": "kalikapur@himalayaoptical.co",
    "Tollygunge": "tollygunge@himalayaoptical.co",
    "Barrackpore": "barrackpore@himalayaoptical.co",
    "Asansol": "asansol@himalayaoptical.co",
    "Berhampore": "berhampore@himalayaoptical.co",
    "Haldia": "haldia@himalayaoptical.co",
    "Purulia": "purulia@himalayaoptical.co",
    "Midnapore": "midnapore@himalayaoptical.co",
    "Suri": "suri@himalayaoptical.co",
    "Ram Raja Tala": "ramrajatala@himalayaoptical.co",
    "Kharagpur": "kharagpur@himalayaoptical.co",
    "Arambagh": "arambagh@himalayaoptical.co",
    "Gt Road Burdwan": "burdwan2@himalayaoptical.co",
    "Durgapur Mall": "durgapur@himalayaoptical.co",
    "Chinsurah": "chinsurah@himalayaoptical.co",
    "Kanchrapara": "kanchrapara@himalayaoptical.co",
    "Krishnanagar": "krishnanagar@himalayaoptical.co",
    "Serampore": "sreerampur@himalayaoptical.co",
    "Chandannagar": "chandannagar@himalayaoptical.co",
    "Uttarpara": "uttarpara@himalayaoptical.co",
    "Ranaghat": "ranaghat@himalayaoptical.co"
  };

  // Get Store Name
  let storeName = "";
  try {
    storeName = sheet.getRange(row, storeNameColumn).getValue().toString().trim();
  } catch (err) {
    console.error("Error reading store name: " + err);
  }

  let userEmail = storeEmailMap[storeName] || "";
  
  // --- COUNTER LOGIC ---
  const props = PropertiesService.getScriptProperties();
  let counter = props.getProperty("TICKET_COUNTER");
  
  if (!counter || counter == "0") {
    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const ids = sheet.getRange(1, ticketColumn, lastRow, 1).getValues().flat();
      let maxId = 0;
      ids.forEach(val => {
        if (typeof val === 'string' && val.startsWith("TIC")) {
          let num = parseInt(val.replace("TIC", ""), 10);
          if (!isNaN(num) && num > maxId) maxId = num;
        }
      });
      counter = maxId;
    } else {
      counter = 0;
    }
  }
  
  counter = Number(counter) + 1;
  const formatted = ("0000" + counter).slice(-4);
  const ticketID = "TIC" + formatted;

  try {
    sheet.getRange(row, ticketColumn).setValue(ticketID);
    props.setProperty("TICKET_COUNTER", counter);
  } catch (err) {
    Utilities.sleep(1000);
    sheet.getRange(row, ticketColumn).setValue(ticketID);
  }

  // --- EXECUTE SEPARATE DATA SYNC ---
  syncToDataSheet(ss, sheet, row);

  // --- FORM DATA & CONFIRMATION ---
  let submissionDetails = "";
  try {
    const formUrl = ss.getFormUrl();
    if (formUrl) {
      const form = FormApp.openByUrl(formUrl);
      const msg = "Thankyou for the Submission a mail has been sent to your email with details, someone will contact you shortly";
      form.setConfirmationMessage(msg);

      if (e.response) {
        const itemResponses = e.response.getItemResponses();
        itemResponses.forEach(res => {
          submissionDetails += res.getItem().getTitle() + ": " + res.getResponse() + "\n";
        });
      } else {
        const latestResponse = form.getResponses().pop();
        if (latestResponse) {
          latestResponse.getItemResponses().forEach(res => {
            submissionDetails += res.getItem().getTitle() + ": " + res.getResponse() + "\n";
          });
          if (!userEmail) userEmail = latestResponse.getRespondentEmail();
        }
      }
    }
  } catch (err) {
    console.error("Form error: " + err);
  }

  // --- SEND EMAIL ---
  if (userEmail && userEmail.includes("@")) {
    let attempts = 0;
    let sent = false;
    while (!sent && attempts < 3) {
      try {
        MailApp.sendEmail({
          to: userEmail.trim(),
          subject: "Confirmation: Ticket ID " + ticketID + " for " + storeName,
          body: "Hello " + storeName + " Team,\n\n" +
                "Thank you for reaching out to the ERP Helpline. Your request has been logged successfully.\n\n" +
                "--- TICKET SUMMARY ---\n" +
                "Ticket ID: " + ticketID + "\n" +
                "Store Name: " + storeName + "\n" +
                "Status: Pending Review\n\n" +
                "--- SUBMISSION DETAILS ---\n" + 
                submissionDetails + "\n\n" +
                "Please keep this ID for your records.\n\n" +
                "Thanks & Regards\n" +
                "Team ERP\n" +
                "033 4041 5091 | 033 4530 4358 | 033 4041 5066\n" +
                "Mon to Friday 11:00 - 7:00, Saturday 11:00 - 6:00"
        });
        sent = true;
      } catch (err) {
        attempts++;
        Utilities.sleep(2000 * attempts);
      }
    }
  }
}

/**
 * SEPARATE FUNCTION: Copies data from "ERP Helpline" to "Data"
 */
function syncToDataSheet(ss, sourceSheet, sourceRow) {
  try {
    const dataSheet = ss.getSheetByName("Data");
    if (!dataSheet) return;

    // Read full source row (Columns A to J)
    const sourceValues = sourceSheet.getRange(sourceRow, 1, 1, 10).getValues()[0];
    
    // Mapping:
    const valA = sourceValues[0]; // Column A
    const valB = sourceValues[1]; // Column B
    const valC = sourceValues[2]; // Column C
    const valD = sourceValues[3]; // Column D
    const valF = sourceValues[5]; // Column F
    const valG = sourceValues[6]; // Column G
    const valH = sourceValues[7]; // Column H
    const valI = sourceValues[8]; // Column I
    const valJ = sourceValues[4]; // Column E
    // --- CHECK IF valI IS EMPTY ---
    // If valI is null, undefined, or empty string "", it becomes "NA"
    var cleanValI = (valI && valI.toString().trim() !== "") ? valI : "NA";
    var cleanValJ = (valJ && valJ.toString().trim() !== "") ? valJ : "No Contact Submitted";
    // --- 2. NEW: CLEAN UP valG (REMOVE EMPTY LINES & CLUMSY SPACES) ---
    var cleanValG = "";
    if (valG) {
      cleanValG = valG.toString()
        .replace(/\r\n/g, "\n")      // Normalize all line breaks to standard newlines
        .split("\n")                 // Split the text into individual lines
        .map(line => line.trim())    // Remove spaces from the beginning and end of every line
        .filter(line => line !== "") // Throw away completely empty lines
        .join("\n");                 // Glue it all back together line-by-line
    }
    
    // Find ACTUAL next empty row in "Data" sheet (more robust than getLastRow)
    // We scan Column B (where Store Name goes) from bottom up to find the last text entry
    const colBValues = dataSheet.getRange("B:B").getValues();
    let lastRowWithData = 0;
    for (let i = colBValues.length - 1; i >= 0; i--) {
      if (colBValues[i][0] !== "") {
        lastRowWithData = i + 1;
        break;
      }
    }
    const targetRow = lastRowWithData + 1;
    
    // Set values individually
    dataSheet.getRange(targetRow, 3).setValue(valA);                  // ERP A -> Data C
    dataSheet.getRange(targetRow, 2).setValue(valC);                  // ERP C -> Data B
    dataSheet.getRange(targetRow, 5).setValue(valD);                  // ERP D -> Data E
    dataSheet.getRange(targetRow, 6).setValue(valF);                  // ERP F -> Data F
    // --- CHANGED LOGIC FOR COLUMN 7 (DATA G) ---
    var targetCellG = dataSheet.getRange(targetRow, 7);
    // Stores Point
    targetCellG.setValue(valB + ">" + "\n• Store's Issue: " + valG + "\n• Store's Remarks: " + cleanValI + "\n ------------------------------------------------------------------------------------------" + "\n• Supports Remarks: ");  
    dataSheet.getRange(targetRow, 13).setNote("Store's:\n• Issue: " + cleanValG + "\n• Remarks: " + cleanValI); // Special data goes into the Note
    dataSheet.getRange(targetRow, 5).setNote(cleanValJ); // Contact info goes to Name as note
    // --------------------------------------------
    dataSheet.getRange(targetRow, 8).setValue(valH);                  // ERP H -> Data H
    dataSheet.getRange(targetRow, 10).setValue("Pending");            // Set Status to Pending in Column J
    // ADD THIS LINE BELOW TO AUTOMATICALLY ADD THE FORMULA TO COLUMN D
    dataSheet.getRange(targetRow, 4).setFormula('=IF(C' + targetRow + '="","",INT(C' + targetRow + '))'); // ERP A -> Data D(Formula)
    
    console.log("Data synced successfully to row " + targetRow);
  } catch (err) {
    console.error("Error in syncToDataSheet: " + err);
  }
}

function resetCounter() {
  const props = PropertiesService.getScriptProperties();
  props.setProperty("TICKET_COUNTER", 0);
  console.log("Ticket counter memory has been cleared.");
}
