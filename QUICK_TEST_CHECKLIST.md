# Quick Testing Checklist - MTB Credit Card Application

**Date:** ___________
**Tester:** ___________
**Environment:** ☐ Development | ☐ Production

---

## 🚀 CRITICAL PATH TESTS (Must Pass)

### 1. Application Load
- [ ] Landing page loads within 3 seconds
- [ ] No console errors
- [ ] MTB logo and branding visible
- [ ] All images load correctly

### 2. Start New Application
- [ ] "Apply Now" button works
- [ ] Navigate to application form
- [ ] Step 1 (Card Selection) loads
- [ ] Progress indicator shows "Step 1 of 13"

### 3. Complete Application Form
- [ ] **Step 1:** Select card type → Continue works
- [ ] **Step 2:** Fill personal info → Validation works → Continue works
- [ ] **Step 3:** Fill professional info → Continue works
- [ ] **Step 4:** Enter income → Continue works
- [ ] **Step 5:** Add bank account (optional) → Continue works
- [ ] **Step 6:** Add credit facility (optional) → Continue works
- [ ] **Step 7:** Fill nominee info → Accept declaration → Continue works
- [ ] **Step 8:** Add supplementary card (optional) → Continue works
- [ ] **Step 9:** Add references → Continue works
- [ ] **Step 10:** Upload photo and signature → Continue works
- [ ] **Step 11:** Setup auto debit → Continue works
- [ ] **Step 12:** Complete declarations → Upload documents → Continue works
- [ ] **Step 13:** Review all data → Accept terms → Capture photo → Submit

### 4. Auto-Save Functionality
- [ ] Wait 3 seconds → "Saving..." indicator appears
- [ ] Wait 2 more seconds → "Saved X mins ago" appears
- [ ] Refresh page → All data restored
- [ ] Navigate between steps → Data persists

### 5. Submit Application
- [ ] Click "Submit Application" → Loading appears
- [ ] Wait for response → Success message shown
- [ ] Application ID displayed
- [ ] Redirected to dashboard
- [ ] Application shown in "Submitted" section

---

## 🔒 SECURITY TESTS

### Session Management
- [ ] Wait 28 minutes → Warning dialog appears
- [ ] Click "Extend Session" → Session extended
- [ ] Wait 30 minutes → Auto-logout
- [ ] Check localStorage → Data cleared
- [ ] Redirected to login page

### Data Protection
- [ ] Fill sensitive information
- [ ] Logout → All data cleared from storage
- [ ] Login again → No previous data visible
- [ ] Check browser DevTools → No sensitive data in plain text

---

## 📱 RESPONSIVE TESTS

### Mobile (375px width)
- [ ] Landing page stacks correctly
- [ ] Navigation works with touch
- [ ] Form fields are tappable
- [ ] Buttons are ≥44x44px
- [ ] No horizontal scrolling
- [ ] Camera capture works
- [ ] Keyboard doesn't hide inputs

### Tablet (768px width)
- [ ] Layout adjusts appropriately
- [ ] Side-by-side fields display correctly
- [ ] Images optimize for tablet
- [ ] Touch interactions work

### Desktop (1920px width)
- [ ] Full layout displays
- [ ] All features accessible
- [ ] Hover states work
- [ ] Keyboard navigation works

---

## ♿ ACCESSIBILITY TESTS

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Shift+Tab works in reverse
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Focus indicator visible

### Screen Reader
- [ ] Alt text on all images
- [ ] Form fields have labels
- [ ] Error messages are announced
- [ ] "Skip to content" link works
- [ ] Progress bars announced

### Color & Contrast
- [ ] Text contrast ≥ 4.5:1
- [ ] Large text contrast ≥ 3:1
- [ ] Color not sole indicator
- [ ] Focus indicators visible

---

## 🐛 ERROR SCENARIOS

### Validation Errors
- [ ] Submit empty form → Errors shown
- [ ] Invalid email → Email error
- [ ] Invalid phone → Phone error
- [ ] Invalid NID → NID error
- [ ] Required field missing → Required error

### Network Errors
- [ ] Disconnect internet → Submit form → Error message
- [ ] Slow network → Loading indicator shows
- [ ] Server error → Error message displayed

---

## 👤 RM ASSISTED MODE TESTS

### RM Login
- [ ] Navigate to `/rm/login`
- [ ] Enter valid credentials → Login successful
- [ ] Enter invalid credentials → Error shown
- [ ] Dashboard loads with RM view

### Assisted Application
- [ ] Click "New Application"
- [ ] Enter customer mobile → Search works
- [ ] Select customer → Customer info shown
- [ ] Start application → Form loads with "ASSISTED" badge
- [ ] Fill form on behalf of customer → Works
- [ ] Submit application → Successful

---

## 📊 DASHBOARD TESTS

### Applicant Dashboard
- [ ] Login as applicant
- [ ] View submitted applications
- [ ] View draft applications
- [ ] Click "Continue" on draft → Resumes correctly
- [ ] Track application status → Works
- [ ] View application details → Details shown

### RM Dashboard
- [ ] View statistics → Numbers correct
- [ ] View customer list → List displayed
- [ ] Search customer → Works
- [ ] Start new application → Works
- [ ] View existing applications → Details shown

---

## ✅ ACCEPTANCE CRITERIA

### Must Have (Blocking if failed)
- [ ] All 13 form steps work correctly
- [ ] Auto-save works
- [ ] Submit application works
- [ ] Session expiry works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Accessible (basic keyboard nav)

### Should Have (Warning if failed)
- [ ] Page load < 3 seconds
- [ ] All validations work
- [ ] Error handling works
- [ ] WCAG AA compliant

### Nice to Have
- [ ] Smooth animations
- [ ] Progress indicators
- [ ] Help text
- [ ] Advanced accessibility

---

## 📝 TEST RESULTS

**Total Tests:** _____
**Passed:** _____
**Failed:** _____
**Blocked:** _____

**Overall Status:** ☐ PASS | ☐ FAIL | ☐ CONDITIONAL PASS

### Critical Issues Found:

1.
2.
3.

### Recommendations:

1.
2.
3.

---

**Tester Signature:** ___________
**Date:** ___________
