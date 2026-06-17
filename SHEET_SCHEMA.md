# Sheet Schema Documentation - Updated for New Structure

## Overview

The ERP Helpdesk system uses these sheets:
1. **Helpdesk Form** - Direct form responses (9 columns)
2. **Data** - Master tracking and processing (13+ columns)

---

## Sheet 1: "Helpdesk Form"

This sheet stores direct Google Form submissions.

### Column Structure

| Col | Header | Type | Auto | Source |
|-----|--------|------|------|--------|
| A | Timestamp | DateTime | ✅ | Form (submission time) |
| B | ID | Text | ✅ | Form (auto-assigned) |
| C | Select Your Store | Text | ❌ | Form dropdown |
| D | Your Name | Text | ❌ | Form answer |
| E | Your Contact No. | Text | ❌ | Form answer |
| F | ERP Order No. / Requisition No. | Text | ❌ | Form answer |
| G | Issue Description | Text | ❌ | Form answer |
| H | Choose Module | Text | ❌ | Form dropdown |
| I | Remarks | Text | ❌ | Form answer |

### Example Data

```
A           | B   | C       | D        | E          | F      | G              | H         | I
2026-06-17  | 1   | Store A | John Doe | 9876543210 | ORD001 | Printer broken | Technical | Not tested
2026-06-17  | 2   | Store B | Jane Sm. | 9876543211 | REQ002 | Login issues   | Software  | Urgent
```

### Auto-Fill Process

```
Google Form (https://forms.gle)
    ↓ (auto-submits when form is submitted)
Helpdesk Form Sheet (Columns A-I)
    ↓ (trigger processes)
OnFormSubmit() Function
    ├─→ Read from Helpdesk Form
    ├─→ Copy to Data Sheet
    ├─→ Send confirmation email
    └─→ Complete
```

---

## Sheet 2: "Data"

Master tracking sheet with processed ticket information.

### Column Structure

| Col | Header | Type | Auto | Manual | Notes |
|-----|--------|------|------|--------|-------|
| A | SL | Number | ✅ | ❌ | Auto-increment: =ROW()-1 |
| B | Store Name | Text | ✅ | ❌ | From form, copied by trigger |
| C | Date | Date | ✅ | ❌ | From form, creation date |
| D | Date1 | Date | ❌ | ✅ | Optional additional date |
| E | Who Called | Text | ✅ | ❌ | From form (Your Name) |
| F | Reference No | Text | ✅ | ❌ | From form (Order/Req No.) |
| G | Reference | Text | ❌ | ✅ | Manual reference field |
| H | Module Issue | Text | ✅ | ❌ | From form (Choose Module) |
| I | Assigned To | Text | ❌ | ✅ | Manual: staff member name |
| J | Status | Dropdown | ❌ | ✅ | Pending/In Progress/Solved |
| K | Error Source | Text | ❌ | ✅ | Manual: where error originated |
| L | Remarks | Text | ❌ | ✅ | Manual: internal notes |
| M | Mail | DateTime | ✅ | ❌ | Formula: Email sent timestamp |

### Example Data

```
A | B       | C          | D | E        | F      | G | H         | I       | J          | K     | L           | M
1 | Store A | 2026-06-17 |   | John Doe | ORD001 |   | Technical | Manager| Solved     | Code  | Fixed bug   | 2026-06-17
2 | Store B | 2026-06-17 |   | Jane Sm. | REQ002 |   | Software  | Staff  | Pending    |       | In review   |
3 | Store A | 2026-06-17 |   | Bob      | ORD002 |   | Hardware  |        | In Prog.   |       | Testing     |
```

---

## Special Formulas

### Column A (SL) - Sequential Row Number

**Formula (Row 2 only):**
```javascript
=ROW()-1
```

**Or entire column (more reliable):**
```javascript
=SEQUENCE(COUNTA(B:B))
```

**Purpose:** Auto-increment row numbers (1, 2, 3...)
**Updates:** Automatic when new rows added

### Column M (Mail) - Email Timestamp

**Formula (Row 2, applies to all rows):**
```javascript
=MAP(J2:J2000, LAMBDA(row, IF(row="solved", IF(OFFSET(row, 0, 5)<>"", OFFSET(row, 0, 5), NOW()), "")))
```

**How it works:**
1. Check if Column J (Status) = "solved" (lowercase)
2. If yes:
   - Check Column O (offset +5) for existing value
   - If has value: Use that (email already sent)
   - If empty: Use NOW() (current timestamp)
3. If no: Leave empty

**Purpose:** Auto-fill email sent timestamp when status changes to Solved  
**Updates:** Real-time on sheet change  
**Example:**
- Status = "Pending" → M = empty
- Status = "In Progress" → M = empty  
- Status = "Solved" → M = timestamp (e.g., 6/17/2026 2:30 PM)

---

## Data Flow & Processing

### Complete Ticket Lifecycle

**Day 1: Ticket Creation**

```
1. User submits form at: https://forms.gle

2. Form auto-populates Helpdesk Form sheet:
   A2: 2026-06-17 10:30 (timestamp)
   B2: 1 (auto ID)
   C2: Store A (selected)
   D2: John Doe (name)
   E2: 9876543210 (phone)
   F2: ORD001 (order no.)
   G2: Printer broken (issue)
   H2: Technical (module)
   I2: Not tested yet (remarks)

3. OnFormSubmit trigger runs automatically:
   - Copies data to Data sheet row 2
   - A2: 1 (=ROW()-1)
   - B2: Store A
   - C2: 2026-06-17
   - E2: John Doe
   - F2: ORD001
   - H2: Technical
   - J2: "Pending" (default status)
   - M2: (empty, status not Solved yet)

4. Confirmation email sent to store_a@[MASKED]
```

**Day 2: Assignment**

```
Staff manually updates Data sheet:
   I2: "Manager" (Assigned To)
   J2: "In Progress" (Status changed)
   M2: (still empty, not Solved yet)
```

**Day 3: Resolution**

```
Staff marks as resolved:
   J2: "Solved" (Status changed to solved - lowercase)
   M2: AUTO-FILLS → 2026-06-17 14:30:00 (timestamp)

StatusMonitor trigger (every 30 min):
   - Detects J2 = "Solved"
   - Checks M2 (has timestamp = email sent before?)
   - If first time: Sends resolution email
   - M2 stays locked with original timestamp
   
   - Next run: Sees M2 already has value, SKIPS
```

---

## Field Mapping: Form → Helpdesk Form → Data

### Processing Pipeline

```
Google Form Field                  Helpdesk Form    Data Sheet    Processing
═══════════════════════════════════════════════════════════════════════════════
Form Timestamp              →       Column A         Column C      Auto-copied
Form ID                     →       Column B         (not used)    Auto-assigned
Select Your Store           →       Column C         Column B      Copied, formatted
Your Name                   →       Column D         Column E      Copied
Your Contact No.            →       Column E         (in notes)    Copied
ERP Order No. / Req No.     →       Column F         Column F      Copied
Issue Description           →       Column G         Column H      Copied & formatted
Choose Module               →       Column H         Column H      Copied
Remarks                     →       Column I         Column L      Copied
```

---

## Status Field (Column J) - Lifecycle

### Valid Status Values

| Status | Meaning | Email Triggered |
|--------|---------|------------------|
| Pending | New ticket, awaiting assignment | No |
| In Progress | Being worked on | No |
| Solved | Issue resolved, ready to notify | **YES** |
| Closed | Notification sent (optional) | No |

### Status Workflow

```
Ticket Created
    ↓
J2 = "Pending"
M2 = empty
    ↓ (staff reviews)
    ↓
J2 = "In Progress"
M2 = empty
    ↓ (issue resolved)
    ↓
J2 = "Solved" ← TRIGGERS: M2 formula auto-fills
M2 = 2026-06-17 14:30:00 ← StatusMonitor sees this
    ↓ (email sent)
    ↓
J2 = "Closed" (optional, staff manually updates)
M2 = 2026-06-17 14:30:00 (unchanged)
```

### Case Sensitivity

- Formula checks for **lowercase "solved"**
- Valid: "solved", "SOLVED" (auto-converted)
- Invalid: "Solved!", "resolve", "Done"

---

## Email Notification Trigger (Column M)

### How Column M Works

**When Status Changes to "Solved":**

```
1. Formula in M2 activates
2. Checks if this is first time (OFFSET cell empty?)
3. If first time: Sets M2 = NOW() (current timestamp)
4. If already has value: Keeps existing timestamp
5. Result: Locked timestamp showing email time
```

**StatusMonitor Trigger Integration:**

```
Every 30 minutes:
    ↓
Scan Column J for "Solved"
    ↓
Check Column M:
    - If empty: Email not sent → SEND EMAIL
    - If has timestamp: Email already sent → SKIP
    ↓
After sending: M stays same (locked timestamp)
```

---

## Column Purposes Summary

### Information Columns (B-E)
- **B: Store Name** - Which store/location
- **C: Date** - When ticket created
- **E: Who Called** - Person who reported issue

### Reference Columns (F-H)
- **F: Reference No** - Related order/requisition number
- **G: Reference** - Additional reference (optional)
- **H: Module Issue** - Category/module of issue

### Tracking Columns (I-L)
- **I: Assigned To** - Staff handling ticket
- **J: Status** - Current ticket state
- **K: Error Source** - Where problem originated
- **L: Remarks** - Internal notes/comments

### Auto Columns (A, M)
- **A: SL** - Auto-increment row counter
- **M: Mail** - Auto timestamp when Solved

---

## Validation Rules

### Required Fields
- Column B (Store Name) - Must match form dropdown
- Column C (Date) - Auto-filled
- Column H (Module Issue) - Auto-filled

### Optional Fields
- Column D (Date1) - Can be empty
- Column G (Reference) - Can be empty
- Column K (Error Source) - Can be empty

### Dropdown Values

**Column J (Status):**
- Pending
- In Progress
- Solved
- Closed

---

## Performance & Optimization

### Row Limits
- Active Data rows: ~1000 recommended
- Archive old tickets when > 2000 rows
- Formula covers J2:J2000

### Optimization Tips
1. Archive solved+notified tickets > 90 days
2. Keep Email column M formula simple
3. Clear test/dummy rows regularly
4. Monitor trigger execution logs

---

## Extending the Schema

### To Add New Columns

1. Insert new column in Data sheet
2. Add header in row 1
3. (Optional) Update form to include new field
4. Update `OnFormSubmit.gs` to map field
5. Test with sample data

### Example: Add "Priority" Column

```javascript
// In OnFormSubmit.gs, after line 225:
const priority = sourceValues[6];  // From form
dataSheet.getRange(targetRow, 14).setValue(priority);  // Column N
```

---

## Backup & Recovery

### Critical Data
- **Helpdesk Form**: Form auto-saves, cannot be lost
- **Data**: Master tracking - MUST backup regularly
- **Archive**: Old tickets - backup monthly

### Backup Process

1. **Monthly**: Download Data sheet as CSV
2. **Store**: Save to Google Drive backup folder
3. **Keep**: Last 3 months of backups
4. **Document**: Any manual data corrections

---

## Related Documentation

- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - How to set up
- [MAIL_COLUMN_FORMULA.md](./MAIL_COLUMN_FORMULA.md) - Formula details
- [TRIGGER_SETUP.md](./TRIGGER_SETUP.md) - Trigger configuration
- Form: https://forms.gle
