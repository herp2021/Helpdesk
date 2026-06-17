# How to Create & Link a Google Form to Your Helpdesk Sheet

## Overview

This guide shows you how to create a Google Form that will automatically submit data to your "Helpdesk Form" sheet.

**Note:** You need to create your own form and link it to your sheet.

---

## Step 1: Create a New Google Form

### 1.1 Open Google Forms

1. Go to [Google Forms](https://forms.google.com/)
2. Click **"+ Create new form"** (top left)
3. Click **"Blank form"** (or choose a template)

### 1.2 Set Form Title & Description

1. Click **"Untitled form"** (top left)
2. Enter title: **"ERP Helpdesk Submission Form"**
3. Click **"Form description"**
4. Enter: **"Submit your helpdesk tickets here"**
5. Click outside to save

---

## Step 2: Add Form Questions

Add these 9 fields in order. For each question:

### Question 1: Timestamp (Auto-added by form)
**This field is created automatically when you link the form to the sheet.**
Skip this - Google Forms adds it by default.

### Question 2: Your Name

1. Click **"+ Add question"** (left panel)
2. **Question title**: "Your Name"
3. **Question type**: Short answer
4. **Make required**: Yes (click toggle)
5. Click **"Next question"**

### Question 3: Your Contact No.

1. Click **"+ Add question"**
2. **Question title**: "Your Contact No."
3. **Question type**: Short answer
4. **Placeholder text**: "98765432XX"
5. **Make required**: Yes
6. Click **"Next question"**

### Question 4: Select Your Store

1. Click **"+ Add question"**
2. **Question title**: "Select Your Store"
3. **Question type**: Multiple choice (dropdown)
4. **Options**: Add these stores:
   - Store A
   - Store B
   - Store C
   - Store D
   - Store E
   - (Add more as needed)
5. **Make required**: Yes
6. Click **"Next question"**

### Question 5: ERP Order No. / Requisition No.

1. Click **"+ Add question"**
2. **Question title**: "ERP Order No. / Requisition No."
3. **Question type**: Short answer
4. **Placeholder text**: "ORD-0001 or REQ-0001"
5. **Make required**: No
6. Click **"Next question"**

### Question 6: Issue Description

1. Click **"+ Add question"**
2. **Question title**: "Issue Description"
3. **Question type**: Paragraph (long text)
4. **Placeholder text**: "Please describe your issue in detail"
5. **Make required**: Yes
6. Click **"Next question"**

### Question 7: Choose Module

1. Click **"+ Add question"**
2. **Question title**: "Choose Module"
3. **Question type**: Multiple choice (dropdown)
4. **Options**: Add these modules:
   - Technical
   - Software
   - Hardware
   - Operational
   - Other
5. **Make required**: Yes
6. Click **"Next question"**

### Question 8: Remarks

1. Click **"+ Add question"**
2. **Question title**: "Remarks"
3. **Question type**: Paragraph (long text)
4. **Placeholder text**: "Any additional remarks or notes"
5. **Make required**: No
6. Click **"Done"** or **"Next question"**

---

## Step 3: Customize Form (Optional)

### 3.1 Add Form Header Image

1. Click the image icon at top of form
2. Upload or select a company logo

### 3.2 Change Form Theme

1. Click the palette icon ("Customize theme") - top right
2. Choose a color scheme
3. Click "Save"

### 3.3 Add Confirmation Message

1. Click the settings icon (gear, top right)
2. Go to **"Confirmation page"** tab
3. Enable: "Show confirmation message"
4. Enter message: **"Thank you! Your ticket has been submitted. Our team will contact you shortly."**
5. Click **"Save"**

---

## Step 4: Link Form to Google Sheet

### 4.1 Open Form Responses

1. In your Google Form, click **"Responses"** tab (top middle)
2. You should see **"No responses yet"** (or existing responses)

### 4.2 Link to Spreadsheet

1. Click the **Google Sheets icon** (📊) - top right corner
2. This opens a menu with options:
   - **"Create a new spreadsheet"** - Creates new sheet (recommended)
   - **"Select existing spreadsheet"** - Links to your existing sheet

### 4.3 Option A: Create New Sheet (Simpler)

1. Click **"Create a new spreadsheet"**
2. Google creates a new sheet named something like "ERP Helpdesk Submission Form (Responses)"
3. A sheet named "Form Responses 1" is created automatically
4. Form responses will populate this sheet

### 4.4 Option B: Link to Existing Sheet (Recommended for Multi-Sheet Setup)

If you already have your "Helpdesk Form" sheet:

1. Click **"Link to existing spreadsheet"**
2. **Enter spreadsheet name or ID** of your sheet
3. In the new dialog:
   - **Spreadsheet**: Select your "ERP Helpdesk" sheet
   - **Sheet name**: Select or create "Helpdesk Form"
4. Click **"Create"**
5. Form responses now populate into your existing sheet

---

## Step 5: Verify Form-Sheet Connection

### 5.1 Test Form Submission

1. In Google Form, click **"Preview"** (eye icon, top right)
2. Fill out all fields:
   - Your Name: "Test User"
   - Contact: "9876543210"
   - Store: "Store A"
   - Order No.: "TEST001"
   - Issue: "Test issue description"
   - Module: "Technical"
   - Remarks: "Testing form"
3. Click **"Submit"**
4. You should see confirmation message

### 5.2 Check Sheet

1. Open your Google Sheet ("Helpdesk Form" sheet)
2. Refresh the page (Ctrl+R or Cmd+R)
3. New row should appear with your test data

**Expected columns in the sheet:**
- Column A: Timestamp (auto-filled by form)
- Column B: Your Name ("Test User")
- Column C: Your Contact No. ("9876543210")
- Column D: Select Your Store ("Store A")
- Column E: ERP Order No. / Requisition No. ("TEST001")
- Column F: Issue Description ("Test issue...")
- Column G: Choose Module ("Technical")
- Column H: Remarks ("Testing form")

**If data appeared:** ✅ Your form is correctly linked!

---

## Step 6: Customize Sheet Columns (IMPORTANT)

### 6.1 Rename Columns to Match Your Schema

The form automatically creates columns, but the names might not match exactly. You need to rename them:

**Current (from form)**:
- Column A: Timestamp ✓ (correct)
- Column B: Your Name
- Column C: Your Contact No.
- Column D: Select Your Store
- Column E: ERP Order No. / Requisition No.
- Column F: Issue Description
- Column G: Choose Module
- Column H: Remarks

**Required (for Data sheet sync)**:
- Column A: Timestamp ✓
- Column B: ID (for auto-ID) - ADD NEW
- Column C: Select Your Store (move from D)
- Column D: Your Name (move from B)
- Column E: Your Contact No. (move from C)
- Column F: ERP Order No. / Requisition No. (move from E)
- Column G: Issue Description (move from F)
- Column H: Choose Module (move from G)
- Column I: Remarks (move from H)

### 6.2 How to Reorganize Columns

**Option 1: Rename in Place (Recommended)**

1. Click on cell A1 (Timestamp)
2. Keep as is
3. Click on B1
4. Type: "ID"
5. Click on C1
6. Type: "Select Your Store"
7. Continue renaming...

**Option 2: Delete and Reorder**

1. If columns are in wrong order, right-click column header
2. Click **"Delete column"**
3. Insert new columns as needed
4. Drag columns to reorder (select column, drag to new position)

### 6.3 Add ID Column

1. Right-click on Column B header
2. Click **"Insert 1 left"**
3. Click on B1, type: "ID"
4. In B2, enter: `=ROW()-1`
5. Copy down to auto-generate IDs (1, 2, 3...)

---

## Step 7: Get Your Form Link

### 7.1 Share the Form

1. In your Google Form, click **"Send"** (top right, paper airplane icon)
2. Choose sharing method:
   - **Email**: Type email addresses
   - **Link**: Copy the shareable link
   - **Embed**: Get embed code for website

### 7.2 Copy Form Link

1. Click **"Link"** tab
2. Make sure **"Anyone with the link can respond"** is selected
3. Click **"Copy link"**
4. This is your form URL (looks like: `https://forms.gle/XXXXXX`)

### 7.3 Share with Users

1. Paste the link in email, Slack, chat, etc.
2. Users click the link to submit tickets
3. Data auto-populates in your sheet

---

## Complete Form Field Mapping

### Form Question → Sheet Column

| Form Question | Sheet Column | Type | Required |
|---|---|---|---|
| (Timestamp auto) | A: Timestamp | DateTime | Auto |
| (ID auto) | B: ID | Number | Auto |
| Your Name | D: Your Name | Text | Yes |
| Your Contact No. | E: Your Contact No. | Text | Yes |
| Select Your Store | C: Select Your Store | Dropdown | Yes |
| ERP Order No. / Req No. | F: ERP Order No. | Text | No |
| Issue Description | G: Issue Description | Text | Yes |
| Choose Module | H: Choose Module | Dropdown | Yes |
| Remarks | I: Remarks | Text | No |

---

## Troubleshooting

### Form not appearing in sheet?

**Problem:** I submitted the form but don't see responses in the sheet

**Solutions:**
1. Refresh the sheet (Ctrl+R)
2. Check you're looking at the correct sheet ("Helpdesk Form")
3. Verify form is linked:
   - Go to Form > Responses tab
   - Click Google Sheets icon
   - Confirm sheet link is active

### Columns are in wrong order?

**Problem:** Form questions in columns B, C, D but I need them in different order

**Solution:**
1. Insert new columns for correct order
2. Copy data from wrong columns to right columns
3. Delete old columns
4. Or rename existing columns to match (simplest)

### Can't rename columns after form linked?

**Problem:** Google Forms keeps reverting my column names

**Solution:**
1. Disconnect form (optional but safer)
2. Manually rename columns
3. Don't rename the form response columns
4. Instead, keep names and use mapping in scripts

### Form link not working?

**Problem:** Form link gives 404 error or "Form no longer available"

**Solutions:**
1. Check link is copied correctly
2. Verify form is not archived (Form Settings)
3. Check sharing settings:
   - Form > Send
   - Make sure "Anyone with link" is selected
4. Copy fresh link from Send dialog

---

## Example: Complete Setup

### Your Final Setup

**Form URL:** `https://forms.gle/YourFormID` (unique to you)

**Share with team:** Send above link in email/chat

**User submits form:**
```
Form Fields:
  Your Name: "John Doe"
  Your Contact No.: "9876543210"
  Select Your Store: "Store A"
  ERP Order No.: "ORD001"
  Issue Description: "Printer not working"
  Choose Module: "Hardware"
  Remarks: "Urgent, affects 5 users"
```

**Auto-populates in sheet:**
```
Helpdesk Form sheet, Row 2:
  A: 2026-06-17 10:30:45 (Timestamp)
  B: 1 (ID)
  C: Store A
  D: John Doe
  E: 9876543210
  F: ORD001
  G: Printer not working
  H: Hardware
  I: Urgent, affects 5 users
```

**Then the OnFormSubmit trigger processes and copies to Data sheet:**
```
Data sheet, Row 2:
  A: 1 (SL)
  B: Store A
  C: 2026-06-17 (Date)
  E: John Doe (Who Called)
  F: ORD001 (Reference No)
  H: Hardware (Module Issue)
  J: Pending (Status - default)
  M: (empty - Mail timestamp)
```

---

## Next Steps

1. ✅ Create your Google Form
2. ✅ Add all 9 fields
3. ✅ Link to "Helpdesk Form" sheet
4. ✅ Test with sample submission
5. ✅ Verify data appears in sheet
6. ✅ Copy form link
7. ✅ Share with your team

**Form link format:** `https://forms.gle/XXXXXX`

**Share this link with:** All helpdesk staff, support team, etc.

---

## Related Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Full system setup
- [SHEET_SCHEMA.md](./SHEET_SCHEMA.md) - Sheet column structure
- [MAIL_COLUMN_FORMULA.md](./MAIL_COLUMN_FORMULA.md) - Email tracking formula
- [README.md](./README.md) - System overview
