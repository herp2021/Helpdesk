# Google Sheet ERP Helpdesk System

🏥 A complete helpdesk ticketing system built entirely within Google Sheets and Google Forms.

## Features

✅ **Form Submission Handler** - Automatically processes helpdesk form submissions  
✅ **Ticket Generation** - Auto-generates unique ticket IDs  
✅ **Email Notifications** - Sends confirmation and resolution emails to stores  
✅ **Status Monitoring** - Tracks ticket status and notifies stores when issues are resolved  
✅ **Time-Based Triggers** - Office hours-aware automated processes  
✅ **Data Sync** - Automatically copies form data to tracking sheet  
✅ **Sidebar Dashboard** - Visual pending analysis interface  
✅ **Auto Email Tracking** - Column Y auto-calculates email sent timestamp  

## Quick Start

### 📚 Documentation
1. **[Setup Guide](./SETUP_GUIDE.md)** - Complete step-by-step setup instructions
2. **[Trigger Configuration](./TRIGGER_SETUP.md)** - How to set up automated triggers
3. **[Sheet Schema](./SHEET_SCHEMA.md)** - Database structure and field mappings
4. **[Configuration](./CONFIG_TEMPLATE.js)** - Settings and customization

## Sheet Structure

### Form Sheet: "Helpdesk Form"
Columns: Timestamp | ID | Store | Your Name | Contact No. | Order No. | Issue Description | Module | Remarks

### Tracking Sheet: "Data"
Columns: SL | Store Name | Date | Date1 | Who Called | Reference No | Reference | Module Issue | Assigned To | Status | Error Source | Remarks | Mail

**Special Columns:**
- **Column A (SL)**: Auto-incrementing row number (formula-based)
- **Column M (Mail)**: Auto-calculates email sent timestamp when Status = "Solved"

## Files Overview

| File | Purpose |
|------|----------|
| `OnFormSubmit.gs` | Main trigger for form submissions - generates tickets and syncs data |
| `StatusMonitor.gs` | Time-based trigger - monitors solved tickets and sends notifications |
| `sidebar_logic.gs` | Dashboard backend - provides pending analysis data |
| `sidebar.html` | Dashboard UI - interactive pending tickets interface |
| `time.gs` | OnEdit trigger - handles manual data entry timestamps |

## Architecture

```
Google Form 
    ↓
    ├─→ OnFormSubmit Trigger
    │   ├─→ Auto-sync to "Helpdesk Form" sheet
    │   ├─→ Process and copy to "Data" sheet
    │   ├─→ Send Confirmation Email
    │   └─→ Add to tracking
    ↓
Helpdesk Form Sheet (Form Responses)
    ↓
Data Sheet (Master Tracking)
    ├─→ SL: Auto-increment formula
    ├─→ Column M (Mail): Auto-calculated email timestamp
    │   (When Status = "Solved" → Email sent timestamp)
    ↓
    ├─→ StatusMonitor Trigger (Every 30 min)
    │   ├─→ Check for "Solved" Status
    │   └─→ Send Resolution Email
    ↓
Sidebar Dashboard
    ├─→ Pending Count
    ├─→ Assigned by Person
    └─→ Unassigned Tickets
```

## Column Details

### Data Sheet - Key Columns

| Column | Name | Type | Purpose | Formula/Auto |
|--------|------|------|---------|---------------|
| A | SL | Number | Sequential row number | =ROW()-1 or =SEQUENCE(COUNTA(A:A)-1) |
| B | Store Name | Text | From form dropdown | Auto-synced |
| C | Date | Date | Creation date | Auto-synced |
| D | Date1 | Date | Additional date field | Manual |
| E | Who Called | Text | Person submitting | Auto-synced |
| F | Reference No | Text | Order/Req number | Auto-synced |
| G | Reference | Text | Additional ref | Manual |
| H | Module Issue | Text | Issue category | Auto-synced |
| I | Assigned To | Text | Staff member | Manual |
| J | Status | Dropdown | Pending/In Progress/Solved | Manual |
| K | Error Source | Text | Where error originated | Manual |
| L | Remarks | Text | Internal notes | Manual |
| M | Mail | DateTime | Email sent timestamp | Formula: `=IF(J#="solved", IF(OFFSET(J#, 0, 5)<>"", OFFSET(J#, 0, 5), NOW()), "")` |

### Special Formula - Column M (Mail)

```javascript
// Auto-calculates when to send email notification
=IF(J2="solved", IF(OFFSET(J2, 0, 5)<>"", OFFSET(J2, 0, 5), NOW()), "")

// Or using MAP (for entire column):
=MAP(J2:J2000, LAMBDA(row, IF(row="solved", IF(OFFSET(row, 0, 5)<>"", OFFSET(row, 0, 5), NOW()), "")))
```

**Logic:**
- If Status (Column J) = "solved"
- Check if Column O (offset +5) has a value (email sent time)
- If yes: Show that value
- If no: Show current timestamp (NOW())
- If Status ≠ "solved": Empty

## Office Hours

- **Email Notifications**: 10:00 AM - 7:00 PM
- **Dashboard Updates**: 10:00 AM - 7:00 PM
- **Manual Edits**: Anytime (tracked with timestamps)

## Configuration

Before deploying, update these values in your scripts:

- **Spreadsheet ID**: Update to your Sheet ID
- **Sheet Names**: Match your actual sheet names
- **Email Recipients**: Update store email mapping
- **Phone Numbers**: Update contact information
- **Form Link**: https://forms.gle/

See [CONFIG_TEMPLATE.js](./CONFIG_TEMPLATE.js) for details.

## Troubleshooting

**Tickets not generating?**
- Check that the form is linked to "Helpdesk Form" sheet
- Verify the onFormSubmit trigger is enabled
- Check Apps Script execution logs

**Emails not sending?**
- Verify email addresses are correctly configured
- Check office hours settings (10 AM - 7 PM)
- Review Apps Script error logs

**Email timestamp (Column M) not updating?**
- Ensure formula is correctly entered in Column M
- Check that Status column (J) changes to "solved"
- Formula requires lowercase "solved"

**Dashboard not updating?**
- Ensure sidebar.html and sidebar_logic.gs are in sync
- Clear browser cache and refresh
- Check that the Data sheet exists and has data

## Support

For issues or questions, refer to:
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) for installation help
- [TRIGGER_SETUP.md](./TRIGGER_SETUP.md) for automation setup
- [SHEET_SCHEMA.md](./SHEET_SCHEMA.md) for data structure questions
- Form: https://forms.gle

## License

Unlicense - See LICENSE file for details
