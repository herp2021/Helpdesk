# Data Sheet Setup - Column M (Mail) Formula Guide

## Overview

Column M in the Data sheet automatically tracks when resolution emails are sent to customers.

---

## Column M - Email Timestamp Formula

### Purpose

When a ticket's status changes to "Solved", Column M automatically records:
- The timestamp when the email should be sent
- OR the actual time it was sent (if already sent)

### Formula Options

#### Option 1: Simple Formula (Row-by-row)

Enter this in cell M2, then copy down:

```javascript
=IF(J2="solved", IF(OFFSET(J2, 0, 5)<>"", OFFSET(J2, 0, 5), NOW()), "")
```

**How it works:**
1. Check if J2 (Status) = "solved" (lowercase)
2. If yes:
   - Check offset cell (+5 columns) for a value
   - If has value: Use that (email already sent time)
   - If empty: Use NOW() (current timestamp)
3. If no: Leave empty

#### Option 2: Array Formula (Entire column) - Recommended

Enter this in cell M2 only:

```javascript
=MAP(J2:J2000, LAMBDA(row, IF(row="solved", IF(OFFSET(row, 0, 5)<>"", OFFSET(row, 0, 5), NOW()), "")))
```

**Benefits:**
- Single formula covers 1999 rows
- Automatically applies to new rows
- More efficient
- Easier to maintain

### Installation Steps

1. **Open your Data sheet**
2. **Click on cell M2** (first data row)
3. **Delete any existing content**
4. **Paste one of the formulas above** (Option 2 recommended)
5. **Press Enter**
6. **Formula automatically expands** to all rows

### How to Use

**Step 1: Ticket is created and assigned**
```
Row 2:
J2: "Pending"      → M2: (empty)
J2: "In Progress"  → M2: (empty)
```

**Step 2: Staff marks ticket as solved**
```
Row 2:
J2: "Solved"       → M2: Timestamp appears (e.g., 6/17/2026 2:30:45 PM)
```

**Step 3: Email is sent**
- The timestamp in M2 confirms resolution email should be sent
- Your status monitoring trigger checks this column

### Column Reference

To understand the OFFSET in the formula:

```
J2 = Status column (Reference point)
OFFSET(J2, 0, 5) = 5 columns to the right

Column J = Status
Column K = Error Source       (+1)
Column L = Remarks            (+2)
Column M = Mail               (+3) ← Target (but checking +5)
Column N = [Reserved]         (+4)
Column O = [Reserved]         (+5) ← Where we check for previous value
```

### Example Workflow

```
┌─────────────────────────────────────────────────────┐
│ Ticket Created                                      │
├─────────────────────────────────────────────────────┤
│ J2: "Pending"                                       │
│ M2: (empty)                                         │
│                                                     │
│ ↓ Staff reviews and works on issue                 │
│                                                     │
│ J2: "In Progress"                                   │
│ M2: (empty)                                         │
│                                                     │
│ ↓ Issue is resolved                                │
│                                                     │
│ J2: "Solved" ← Staff manually changes this         │
│ M2: 6/17/2026 3:45:30 PM ← Formula auto-fills!    │
│                                                     │
│ ↓ Status Monitor trigger sees "Solved"             │
│                                                     │
│ ✓ Email sent to customer                           │
│ M2: 6/17/2026 3:45:30 PM ← Timestamp locked       │
└─────────────────────────────────────────────────────┘
```

### Troubleshooting

**Formula shows #ERROR**
- Check that Status column is J
- Ensure "solved" is lowercase
- Verify J column exists

**Formula doesn't update**
- Check if Status value is exactly "solved" (case-sensitive)
- Try clearing M2 and re-entering formula
- Verify sheet is not in read-only mode

**Column M shows NOW() every time**
- Formula is checking OFFSET correctly
- This means Column O has no value yet (normal)
- Timestamp will be fixed once sent

**Need to reset formula?**
1. Click on M2
2. Delete content
3. Re-enter formula
4. Press Enter

### Formula Components Explained

```javascript
=IF(J2="solved",                 // 1. Check if Status = solved
    IF(OFFSET(J2, 0, 5)<>"",     // 2. If yes, check if +5 col has value
       OFFSET(J2, 0, 5),          // 3. If yes, use that value
       NOW()                       // 4. If no, use current time
    ),                             // 5. End inner IF
    ""                             // 6. If Status ≠ solved, empty
)                                  // 7. End outer IF
```

### Alternative: Simpler Formula

If you just want timestamp when status changes:

```javascript
=IF(J2="solved", NOW(), "")
```

**Note:** This will update every time sheet recalculates, showing current time instead of locked timestamp.

### Advanced: With Status Monitor Trigger

Your `StatusMonitor.gs` can also set this value:

```javascript
// In StatusMonitor.gs, after sending email:
dataSheet.getRange(actualRowIndex, 13).setValue(new Date());
// Column M = Column 13
```

---

## Integration with StatusMonitor

### What Column M Does

1. **Tracks email delivery time**
   - When Status = "Solved"
   - M column auto-fills with timestamp

2. **Integrates with triggers**
   - StatusMonitor checks Column M
   - If M2 has timestamp → Email was sent
   - Prevents duplicate emails

3. **Provides audit trail**
   - Shows when resolution was notified
   - Easy to see email delivery history

### Workflow Integration

```
StatusMonitor Trigger (Every 30 min)
    ↓
1. Scan Column J for "Solved" status
2. Check Column M (Mail column)
3. If M is empty → Send email, set Column M = NOW()
4. If M has value → Skip (already sent)
5. Store email delivery record
```

---

## Testing the Formula

### Manual Test

1. Add test data to row 2
2. Set J2 = "Solved"
3. M2 should show timestamp (like: 6/17/2026 2:30:00 PM)
4. Change J2 back to "Pending"
5. M2 should clear (become empty)
6. Change J2 to "Solved" again
7. M2 should show new timestamp

### Bulk Test (First 10 rows)

1. Set J2:J11 = "Solved"
2. M2:M11 should all populate with timestamps
3. Check if all timestamps appear
4. Reset J column back to "Pending"
5. M column should clear

---

## Reference

- **Cell Address**: M2 (and down)
- **Column Name**: Mail
- **Data Type**: DateTime (Timestamp)
- **Update Frequency**: Real-time (on sheet change)
- **Related Columns**: J (Status), K-L (Remarks area)
- **Formula Type**: Array formula (MAP/LAMBDA)

