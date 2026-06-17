# Complete Setup Guide - Google Sheets ERP Helpdesk

## Prerequisites

- Google Account
- Basic familiarity with Google Sheets and Google Forms
- Access to Google Drive

---

## Step 1: Access the Google Form

**Form Link:** https://forms.gle/LBQy4g4pxtpFMUG46

This form is already set up with the correct fields:
- Timestamp (auto)
- ID (auto)
- Select Your Store
- Your Name
- Your Contact No.
- ERP Order No. / Requisition No.
- Issue Description
- Choose Module
- Remarks

**Submitters can fill out and submit the form directly using the above link.**

---

## Step 2: Set Up the Google Sheet

### 2.1 Create or Use Your Google Sheet

1. Go to [Google Drive](https://drive.google.com)
2. Create new or open existing Google Sheet named **"ERP Helpdesk"**
3. **Copy the Spreadsheet ID** from URL:
   - URL: `https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit`
   - Save this ID for step 3

### 2.2 Create "Helpdesk Form" Sheet

1. Rename first sheet to **"Helpdesk Form"**
2. Add these headers in row 1:

| Col | Header |
|-----|--------|
| A | Timestamp |
| B | ID |
| C | Select Your Store |
| D | Your Name |
| E | Your Contact No. |
| F | ERP Order No. / Requisition No. |
| G | Issue Description |
| H | Choose Module |
| I | Remarks |

### 2.3 Link Form to Sheet

1. Open the Google Form: https://forms.gle/LBQy4g4pxtpFMUG46
2. Click **"Responses"** tab (top right)
3. Click **"Link to spreadsheet"** icon (📊)
4. Select your **"ERP Helpdesk"** spreadsheet
5. Select (or create) **"Helpdesk Form"** sheet
6. Click **"Create"**

**Now form responses will auto-populate in the sheet!**

### 2.4 Create "Data" Sheet

1. Add a new sheet and name it **"Data"**
2. Add these headers in row 1:

| Col | Header | Notes |
|-----|--------|-------|
| A | SL | Auto-increment formula |
| B | Store Name | From form |
| C | Date | From form |
| D | Date1 | Manual field |
| E | Who Called | From form |
| F | Reference No | From form |
| G | Reference | Manual field |
| H | Module Issue | From form |
| I | Assigned To | Manual |
| J | Status | Dropdown: Pending/In Progress/Solved |
| K | Error Source | Manual |
| L | Remarks | Manual |
| M | Mail | Email timestamp formula |

### 2.5 Add SL Formula (Column A)

1. Click on cell **A2**
2. Enter this formula:
   ```
   =ROW()-1
   ```
3. Or use this for entire column:
   ```
   =SEQUENCE(COUNTA(B:B))
   ```
4. Copy down to row 1000

### 2.6 Add Mail Formula (Column M)

1. Click on cell **M2**
2. Enter this formula:
   ```
   =MAP(J2:J2000, LAMBDA(row, IF(row="solved", IF(OFFSET(row, 0, 5)<>"", OFFSET(row, 0, 5), NOW()), "")))
   ```
3. Press **Enter**
4. Formula auto-applies to all rows below

**See [MAIL_COLUMN_FORMULA.md](./MAIL_COLUMN_FORMULA.md) for detailed formula explanation.**

---

## Step 3: Set Up Google Apps Script

### 3.1 Open Apps Script Editor

1. In your Google Sheet, go to **"Tools"** → **"Apps Script"**
2. This opens the Apps Script editor

### 3.2 Create Script Files

#### Create OnFormSubmit.gs
1. Create file: **File** → **New** → **Script file**
2. Name it **"OnFormSubmit"**
3. Copy code from `OnFormSubmit.gs` from this repository
4. Update line 14:
   ```javascript
   const spreadsheetId = "YOUR_SPREADSHEET_ID_HERE";
   ```
5. Update store email map (lines 24-66) with actual emails
6. Update phone numbers (line 162) with real contact info

#### Create StatusMonitor.gs
1. Create file: **File** → **New** → **Script file**
2. Name it **"StatusMonitor"**
3. Copy code from `StatusMonitor.gs`
4. Update `spreadsheetId` (line 27)
5. Update store email map (lines 43-85)
6. Update phone numbers (line 119)
7. Update CC email (line 109)

#### Create sidebar_logic.gs
1. Create file: **File** → **New** → **Script file**
2. Name it **"sidebar_logic"**
3. Copy code from `sidebar_logic.gs`

#### Create sidebar.html
1. Create file: **File** → **New** → **HTML file**
2. Name it **"sidebar"**
3. Copy code from `sidebar.html`

#### Create time.gs
1. Create file: **File** → **New** → **Script file**
2. Name it **"time"**
3. Copy code from `time.gs`

### 3.3 Save and Deploy

1. Click **"Save"** (Ctrl+S)
2. You'll be prompted to authorize - click **"Authorize access"**
3. Select your Google Account
4. Click **"Allow"** for permissions

---

## Step 4: Set Up Triggers

### 4.1 Install Form Submission Trigger

1. Go to **"Triggers"** (left sidebar, clock icon)
2. Click **"+ Create new trigger"** (bottom right)
3. Configure:
   - **Function to execute**: `onFormSubmit`
   - **Deployment**: Head deployment
   - **Event source**: From form
   - **Event type**: On form submit
   - **Failure notification**: Email immediately
4. Click **"Save"**

### 4.2 Install StatusMonitor Trigger (Every 30 min)

1. Click **"+ Create new trigger"**
2. Configure:
   - **Function to execute**: `checkStatusAndNotify`
   - **Deployment**: Head deployment
   - **Event source**: Time-driven
   - **Type of time interval**: Minutes timer
   - **Interval**: Every 30 minutes
   - **Failure notification**: Email immediately
3. Click **"Save"**

### 4.3 Install Dashboard Update Trigger (Every hour)

1. Click **"+ Create new trigger"**
2. Configure:
   - **Function to execute**: `checkUnassignedAndNotify`
   - **Deployment**: Head deployment
   - **Event source**: Time-driven
   - **Type of time interval**: Hours timer
   - **Interval**: Every hour
   - **Failure notification**: Email immediately
3. Click **"Save"**

### 4.4 Install Edit Trigger (On manual entry)

1. Click **"+ Create new trigger"**
2. Configure:
   - **Function to execute**: `onEdit`
   - **Deployment**: Head deployment
   - **Event source**: From spreadsheet
   - **Event type**: On edit
   - **Failure notification**: Email immediately
3. Click **"Save"**

---

## Step 5: Configure Email Settings

### 5.1 Update Store Email Map

In both `OnFormSubmit.gs` and `StatusMonitor.gs`:

1. Find the `storeEmailMap` object
2. Replace `store_a@[MASKED]` with actual store email addresses
3. Ensure store names match your form dropdown options

Example:
```javascript
const storeEmailMap = {
  "Store A": "storea@company.com",
  "Store B": "storeb@company.com",
  // ... more stores
};
```

### 5.2 Update CC Email

In `StatusMonitor.gs` (line 109):
```javascript
cc: "manager@company.com",  // Update this
```

### 5.3 Update Phone Numbers

In both files, update phone numbers. Example:
```javascript
"033 4041 5091 | 033 4530 4358 | 033 4041 5066"
```

---

## Step 6: Add Custom Menu (Optional)

The dashboard adds a custom menu to your sheet.

When you open the sheet, you'll see:
- **"🔴 ERP Tools (3)"** - 3 unassigned pending tickets
- Click **"Open Pending Analysis"** to see the dashboard

---

## Step 7: Test the System

### 7.1 Test Form Submission

1. Open form: https://forms.gle/LBQy4g4pxtpFMUG46
2. Fill out and submit a test response
3. Wait ~5 seconds, then refresh your sheet
4. Verify:
   - Row appears in "Helpdesk Form" sheet
   - Data synced to "Data" sheet
   - Column A (SL) auto-filled
   - Column M (Mail) is empty (status not Solved yet)
   - Confirmation email received (check spam)

### 7.2 Test Status Notification

1. In "Data" sheet, find your test row
2. Change Column J (Status) to **"Solved"**
3. Observe Column M (Mail):
   - Should auto-fill with current timestamp
4. Wait for next trigger (30 minutes max)
5. Verify resolution email received

### 7.3 Test Dashboard

1. Open your Google Sheet
2. Click **"ERP Tools"** → **"Open Pending Analysis"**
3. Sidebar opens showing pending tickets
4. Click on store to navigate to that row

---

## Troubleshooting

### Form not submitting to sheet?
- Check form is linked to "Helpdesk Form" sheet
- Verify link is correct in Step 2.3
- Try linking again

### "Spreadsheet ID not found"
- Update the `spreadsheetId` in your scripts
- Verify the ID matches your actual sheet

### "Sheet 'Helpdesk Form' not found"
- Ensure sheet is named exactly **"Helpdesk Form"** (case-sensitive)
- Rename if necessary

### Emails not sending?
- Check office hours (10 AM - 7 PM)
- Verify email addresses in configuration
- Check Apps Script execution logs
- Verify Column J status is exactly "Solved" (lowercase)

### Column M (Mail) not updating?
- Verify formula is in M2: `=MAP(J2:J2000, LAMBDA(...))`
- Check that Status (Column J) = "solved" (lowercase)
- Try clearing M2 and re-entering formula
- Ensure Status dropdown includes "Solved" option

### Triggers not firing?
- Verify triggers are created in Apps Script
- Check execution logs for errors
- Ensure form is linked to sheet
- Verify function names match exactly

---

## Next Steps

✅ Setup is complete! Now:

1. Train staff to use the form: https://forms.gle/LBQy4g4pxtpFMUG46
2. Monitor the "Data" sheet for incoming tickets
3. Update "Assigned To" and "Status" columns as needed
4. Watch Column M auto-fill when tickets are marked "Solved"
5. Monitor dashboard for pending tickets

For more information:
- [TRIGGER_SETUP.md](./TRIGGER_SETUP.md) - Trigger configuration details
- [SHEET_SCHEMA.md](./SHEET_SCHEMA.md) - Data structure documentation
- [MAIL_COLUMN_FORMULA.md](./MAIL_COLUMN_FORMULA.md) - Email timestamp formula
- [CONFIG_TEMPLATE.js](./CONFIG_TEMPLATE.js) - Configuration reference
