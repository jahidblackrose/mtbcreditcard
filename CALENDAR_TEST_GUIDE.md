# Calendar Testing Guide - MTB Credit Card Application

**Test URL:** http://localhost:8086

---

## 🎯 Quick Calendar Test Steps

### 1. Access a Date Field

1. Open browser → Go to **http://localhost:8086**
2. Click **"Apply Now"** button
3. You should be on **Step 1: Card Selection**
4. Click **"Continue"** to go to **Step 2: Personal Information**
5. Find **"Date of Birth"** field
6. Click on the date input

---

## ✅ Visual Tests - What You Should See

### Date View (Default)

**Initial State:**
- [ ] Calendar popup opens with current month
- [ ] All dates have a **light blue background** (Bootstrap style)
- [ ] Today's date has a **darker blue background + border ring**
- [ ] Days are in a 7-column grid (Su Mo Tu We Th Fr Sa)
- [ ] Header shows month name (e.g., "January") and year (e.g., "2026")
- [ ] Navigation arrows on left/right work

**Color Tests:**
- [ ] Today's date: Medium blue background + border
- [ ] Other dates: Light blue tint (bg-primary/5)
- [ ] Hover over any date: Darker blue tint
- [ ] Click a date: It becomes dark blue with white text

### Month View

**How to Access:**
1. Click on the **Month name** (e.g., "January") in the header

**What You Should See:**
- [ ] All 12 months displayed in a 3-column grid
- [ ] All months have **light blue background** (bg-primary/10)
- [ ] Current month (today's month): **Darker blue** (bg-primary/30)
- [ ] Hover over any month: Darker blue tint (bg-primary/20)
- [ ] Click a month: Returns to date view with that month
- [ ] Header shows year only (e.g., "2026")

**Color Tests:**
- [ ] All months: Light blue background
- [ ] Current month: Medium blue with bold text
- [ ] Selected month: Dark blue (if pre-selected)

### Year View

**How to Access:**
1. Click on the **Year** (e.g., "2026") in the header

**What You Should See:**
- [ ] 12 years displayed in a 3-column grid
- [ ] Years in current decade range: **Light blue background** (bg-primary/10)
- [ ] Current year (2026): **Darker blue background** (bg-primary/20)
- [ ] Selected year: **Dark blue** (bg-primary)
- [ ] Out-of-range years (first/last): Grayed out
- [ ] Header shows decade range (e.g., "2020 - 2029")

**Color Tests:**
- [ ] Years 2020-2029: Light blue
- [ ] Year 2026 (current): Medium blue
- [ ] Click a year: Returns to month view
- [ ] Click left/right arrows: Changes decade

---

## 🔍 Functional Tests

### Test 1: Basic Date Selection

1. Open Date of Birth field
2. Click on date **15**
3. **Expected:**
   - [ ] Calendar closes
   - [ ] Field shows **"15/02/2026"** (or current month/day)
   - [ ] Date 15 is highlighted in blue

### Test 2: Navigate to Different Month

1. Open any date field
2. Click the **right arrow** (>)
3. **Expected:**
   - [ ] Next month displays
   - [ ] All dates have light blue background
   - [ ] Today is no longer highlighted with border

4. Click the **left arrow** (<)
5. **Expected:**
   - [ ] Previous month displays
   - [ ] Today gets border highlight again (if visible)

### Test 3: Month Selection

1. Open date field
2. Click on **Month name** (e.g., "February")
3. **Expected:**
   - [ ] Month view opens
   - [ ] All 12 months have light blue background
   - [ ] Current month is darker blue
   - [ ] Header shows only year

4. Click on **"June"**
5. **Expected:**
   - [ ] Returns to date view
   - [ ] June is displayed
   - [ ] Header shows "June 2026"

### Test 4: Year Selection

1. Open date field
2. Click on **Year** (e.g., "2026")
3. **Expected:**
   - [ ] Year view opens
   - [ ] Years 2020-2029 have light blue background
   - [ ] Year 2026 is darker blue (current year)
   - [ ] Header shows "2020 - 2029"

4. Click on year **"2025"**
5. **Expected:**
   - [ ] Returns to month view
   - [ ] Year 2025 is displayed
   - [ ] February 2025 is shown

5. Click on year **"2030"**
6. **Expected:**
   - [ ] Returns to month view
   - [ ] Header shows "February 2030"

### Test 5: Decade Navigation

1. Open date field
2. Go to year view
3. Click the **right arrow** (>)
4. **Expected:**
   - [ ] Next decade displayed: "2030 - 2039"
   - [ ] Years have light blue background

5. Click the **left arrow** (<)
6. **Expected:**
   - [ ] Previous decade displayed: "2020 - 2029"
   - [ ] Years have light blue background

### Test 6: Today Highlight

1. Open date field (should be on current month)
2. **Expected:**
   - [ ] Today's date has **darker blue background**
   - [ ] Today's date has **border ring** around it
   - [ ] Border is the primary color (blue)
   - [ ] Today stands out from other dates

### Test 7: Date Disabled (Min Age)

1. Go to **Step 2: Personal Information**
2. Find **Date of Birth** field
3. Try to select a future date (tomorrow)
4. **Expected:**
   - [ ] Future dates are grayed out (disabled)
   - [ ] Cannot click future dates
   - [ ] Calendar should not allow selection

5. Try to select a date showing you're < 18 years old
6. **Expected:**
   - [ ] Those dates are disabled
   - [ ] Only dates 18+ years ago are selectable

---

## 🎨 Color Verification Checklist

### Year View Colors
- [ ] Years in range: Light blue (bg-primary/10)
- [ ] Current year: Medium blue (bg-primary/20) + bold
- [ ] Selected year: Dark blue (bg-primary) + white text
- [ ] Out of range: Gray

### Month View Colors
- [ ] All months: Light blue (bg-primary/10)
- [ ] Current month: Medium blue (bg-primary/30)
- [ ] Selected month: Dark blue (bg-primary)

### Date View Colors
- [ ] Regular dates: Very light blue (bg-primary/5)
- [ ] Today: Medium blue (bg-primary/30) + border
- [ ] Selected date: Dark blue (bg-primary) + white text
- [ ] Disabled dates: Gray + opacity

---

## 🐛 Common Issues & Fixes

### Issue 1: Calendar Not Closing
**Problem:** Calendar stays open after date selection
**Fix:** Click outside the calendar or press Escape

### Issue 2: Wrong Date Format
**Problem:** Date shows DD-MM-YYYY instead of DD/MM/YYYY
**Expected:** Should be slashes (/) not dashes (-)
**Verify:** Check the date input after selection

### Issue 3: Colors Not Showing
**Problem:** Calendar looks plain, no colors
**Fix:**
1. Hard refresh browser (Ctrl+F5)
2. Clear browser cache
3. Check browser console for CSS errors

---

## 📱 Responsive Test

### Mobile Test
1. Press **F12** (DevTools)
2. Click **Device Toolbar** icon (or press Ctrl+Shift+M)
3. Select **iPhone 12** or any mobile device
4. Open a date field

**Expected:**
- [ ] Calendar fits on mobile screen
- [ ] Days are tappable (44x44px minimum)
- [ ] Colors still work on mobile
- [ ] Can navigate months/years easily

---

## ✅ Pass/Fail Criteria

### Calendar Test: **PASS** if:
- All three views (date/month/year) work
- Bootstrap-style colors are visible
- Today has border highlight
- Navigation works smoothly
- Date format is DD/MM/YYYY (slashes)

### Calendar Test: **FAIL** if:
- No colors show (plain white)
- Today doesn't have border
- Navigation doesn't work
- Wrong date format (dashes instead of slashes)
- Calendar doesn't close after selection

---

## 🎬 Quick Test Script

**Do this:**

1. Open http://localhost:8086
2. Click "Apply Now"
3. Click "Continue" (goes to Step 2)
4. Click "Date of Birth" field
5. **Check:** All dates have light blue background ✅
6. **Check:** Today has border + darker blue ✅
7. Click Month name → **Check:** All months blue ✅
8. Click Year → **Check:** Years 2020-2029 blue ✅
9. Click year 2025 → **Check:** Back to month view ✅
10. Click date 15 → **Check:** Calendar closes, date shows DD/MM/YYYY ✅

---

## 📊 Test Results

**Tester:** ___________
**Date:** ___________
**Browser:** ___________

### Results
- [ ] **Pass** - All colors working correctly
- [ ] **Fail** - Colors not showing
- [ ] **Partial** - Some colors working

**Issues Found:**
1.
2.
3.

---

**End of Calendar Test Guide**
