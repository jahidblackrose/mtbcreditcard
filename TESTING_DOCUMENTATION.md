# MTB Credit Card Application - Testing Documentation

**Version:** 1.0
**Last Updated:** February 15, 2026
**Status:** Phase 8 - Testing & Validation

---

## 📋 Table of Contents

1. [Testing Strategy](#testing-strategy)
2. [Test Infrastructure](#test-infrastructure)
3. [Manual Testing Checklist](#manual-testing-checklist)
4. [Automated Testing Guide](#automated-testing-guide)
5. [Test Cases by Flow](#test-cases-by-flow)
6. [Cross-Browser Testing](#cross-browser-testing)
7. [Performance Testing](#performance-testing)
8. [Security Testing](#security-testing)

---

## 🎯 Testing Strategy

### Testing Levels

1. **Unit Tests** - Individual component and function tests
2. **Integration Tests** - Multiple components working together
3. **End-to-End Tests** - Complete user flows
4. **Manual Tests** - Exploratory and UX testing
5. **Performance Tests** - Load time, bundle size, animations
6. **Security Tests** - Session management, data protection

### Testing Tools

- **Vitest** - Fast unit test runner
- **React Testing Library** - Component testing
- **Playwright** - End-to-end testing (optional)
- **Chrome DevTools** - Performance profiling
- **Lighthouse** - Performance auditing
- ** axe DevTools** - Accessibility testing

---

## 🔧 Test Infrastructure

### Setup

```bash
# Install dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event

# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage
```

### Test Files Structure

```
src/
├── __tests__/
│   ├── components/
│   ├── pages/
│   ├── utils/
│   └── e2e/
└── utils/
    └── testHelpers.ts
```

---

## ✅ Manual Testing Checklist

### Pre-Testing Setup

- [ ] Clear browser cache and cookies
- [ ] Open DevTools for console monitoring
- [ ] Set viewport to different sizes (mobile, tablet, desktop)
- [ ] Enable Lighthouse for performance auditing
- [ ] Open axe DevTools for accessibility checks

### Critical Path Tests

#### 1. Landing Page

**Visual Checks:**
- [ ] Page loads within 3 seconds
- [ ] All images load correctly
- [ ] No console errors
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] MTB branding is consistent
- [ ] Text is readable (contrast ratio)

**Functionality Checks:**
- [ ] "Apply Now" button navigates to application
- [ ] "Track Application" link works
- [ ] "RM Login" link navigates correctly
- [ ] All links are accessible via keyboard
- [ ] Hover states work on buttons
- [ ] Loading states display

---

## 📝 Test Cases by Flow

### Flow 1: New Application (SELF Mode)

#### Test Case 1.1: Landing → Application Start

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Navigate to `/` | Landing page loads | ☐ |
| 2 | Click "Apply Now" | Navigate to `/apply` | ☐ |
| 3 | Check URL | URL is `/apply` | ☐ |
| 4 | Verify session | New session created | ☐ |
| 5 | Check console | No errors | ☐ |

#### Test Case 1.2: Step 1 - Card Selection

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | View Step 1 | 3 card options displayed | ☐ |
| 2 | Check mobile view | Cards stacked vertically | ☐ |
| 3 | Click "VISA Platinum" | Card highlights | ☐ |
| 4 | Check details | Card details shown | ☐ |
| 5 | Click "Continue" | Navigate to Step 2 | ☐ |
| 6 | Verify save | Draft auto-saved | ☐ |

#### Test Case 1.3: Step 2 - Personal Information

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | View Step 2 | Form fields displayed | ☐ |
| 2 | Leave all blank | Validation errors | ☐ |
| 3 | Enter invalid email | Email error shown | ☐ |
| 4 | Enter invalid phone | Phone error shown | ☐ |
| 5 | Enter invalid NID | NID error shown | ☐ |
| 6 | Fill all valid data | No errors | ☐ |
| 7 | Click "Back" | Return to Step 1 | ☐ |
| 8 | Click "Next" | Navigate to Step 3 | ☐ |
| 9 | Check save | Draft saved | ☐ |

#### Test Case 1.4: All Form Steps (3-13)

Repeat for each step:
- [ ] **Step 3: Professional Info** - Employment details validation
- [ ] **Step 4: Monthly Income** - Income calculation
- [ ] **Step 5: Bank Accounts** - Add/remove accounts
- [ ] **Step 6: Credit Facilities** - Add/remove facilities
- [ ] **Step 7: Nominee** - MPP declaration
- [ ] **Step 8: Supplementary Card** - Optional flow
- [ ] **Step 9: References** - Contact references
- [ ] **Step 10: Photo & Signature** - Upload functionality
- [ ] **Step 11: Auto Debit** - Bank selection
- [ ] **Step 12: MID** - Declarations + documents
- [ ] **Step 13: Final Review** - Terms + submit

#### Test Case 1.5: Auto-Save Functionality

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Fill Step 2 data | Data entered | ☐ |
| 2 | Wait 3 seconds | "Saving..." indicator | ☐ |
| 3 | Wait 2 more seconds | "Saved X mins ago" | ☐ |
| 4 | Close browser | - | ☐ |
| 5 | Reopen application | Data restored | ☐ |
| 6 | Check all steps | Data persists | ☐ |

#### Test Case 1.6: Form Navigation

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Go to Step 5 | Step 5 loads | ☐ |
| 2 | Click "Back" | Return to Step 4 | ☐ |
| 3 | Click "Save Draft" | "Saved" indicator | ☐ |
| 4 | Jump to Step 10 | Step 10 loads | ☐ |
| 5 | Verify previous data | Steps 1-9 data present | ☐ |

#### Test Case 1.7: Final Submission

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Complete all 13 steps | All data filled | ☐ |
| 2 | Reach Step 13 | Review page shown | ☐ |
| 3 | Check summary | All data displayed | ☐ |
| 4 | Capture live photo | Photo captured | ☐ |
| 5 | Accept terms | Checkbox checked | ☐ |
| 6 | Click "Submit" | Loading indicator | ☐ |
| 7 | Wait for response | Success message | ☐ |
| 8 | Check application ID | ID generated | ☐ |
| 9 | Redirect | Dashboard shown | ☐ |

---

### Flow 2: RM-Assisted Application

#### Test Case 2.1: RM Login

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Navigate to `/rm/login` | Login page loads | ☐ |
| 2 | Enter staff ID | ID entered | ☐ |
| 3 | Enter password | Password entered | ☐ |
| 4 | Click "Login" | Authentication | ☐ |
| 5 | Valid credentials | Dashboard loads | ☐ |
| 6 | Invalid credentials | Error shown | ☐ |
| 7 | Check session | Session created | ☐ |

#### Test Case 2.2: RM Dashboard

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | View dashboard | Dashboard loads | ☐ |
| 2 | Check stats | Statistics shown | ☐ |
| 3 | View customer list | List displayed | ☐ |
| 4 | Search customer | Search works | ☐ |
| 5 | Click "New Application" | Form opens | ☐ |
| 6 | Check navigation | All links work | ☐ |

#### Test Case 2.3: Start Assisted Application

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Click "New Application" | Application starts | ☐ |
| 2 | Enter customer mobile | Mobile entered | ☐ |
| 3 | Click "Search" | Customer found | ☐ |
| 4 | Verify customer info | Info displayed | ☐ |
| 5 | Click "Start Application" | Step 1 loads | ☐ |
| 6 | Check mode | "ASSISTED" badge shown | ☐ |
| 7 | Fill form with customer | RM can assist | ☐ |

---

### Flow 3: Resume Draft Application

#### Test Case 3.1: View Draft Applications

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Login to dashboard | Dashboard loads | ☐ |
| 2 | Check "Drafts" section | Drafts displayed | ☐ |
| 3 | View draft card | All info shown | ☐ |
| 4 | Check progress bar | Progress accurate | ☐ |
| 5 | Check last saved | Time shown | ☐ |

#### Test Case 3.2: Resume Draft

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Click "Continue" on draft | Application loads | ☐ |
| 2 | Check current step | Correct step shown | ☐ |
| 3 | Verify previous data | All data present | ☐ |
| 4 | Edit existing field | Editable | ☐ |
| 5 | Add new data | Data saves | ☐ |
| 6 | Navigate between steps | Data persists | ☐ |
| 7 | Complete application | Submit successful | ☐ |

---

### Flow 4: Track Application Status

#### Test Case 4.1: Status Tracking

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | From dashboard, click "Track" | Status page loads | ☐ |
| 2 | Enter application ID | ID entered | ☐ |
| 3 | Enter mobile number | Number entered | ☐ |
| 4 | Click "Track" | Status displayed | ☐ |
| 5 | Check timeline | Timeline shown | ☐ |
| 6 | Check current status | Status highlighted | ☐ |
| 7 | View details | Details accurate | ☐ |

#### Test Case 4.2: Status Updates

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Wait for status change | Status updates | ☐ |
| 2 | Refresh page | Updated status | ☐ |
| 3 | Check notifications | Notification shown | ☐ |
| 4 | View document checklist | Documents listed | ☐ |
| 5 | Download document | Download works | ☐ |

---

### Flow 5: Supplementary Card

#### Test Case 5.1: Add Supplementary Card

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Reach Step 8 | Decision shown | ☐ |
| 2 | Click "Add Card" | Form displays | ☐ |
| 3 | Fill nominee details | Details entered | ☐ |
| 4 | Upload photo | Photo uploaded | ☐ |
| 5 | Set spending limit | Limit set | ☐ |
| 6 | Click "Continue" | Validation passes | ☐ |
| 7 | Check summary | Nominee shown | ☐ |
| 8 | Click "Remove" | Card removed | ☐ |

---

## 🔐 Security Testing

### Test Case 6.1: Session Expiry

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Start application | Session active | ☐ |
| 2 | Wait 28 minutes | - | ☐ |
| 3 | Check for warning | Warning dialog shown | ☐ |
| 4 | Click "Extend" | Session extended | ☐ |
| 5 | Wait 30 more minutes | Warning again | ☐ |
| 6 | Let session expire | Auto-logout | ☐ |
| 7 | Check redirect | Login page | ☐ |
| 8 | Check storage | Data cleared | ☐ |

### Test Case 6.2: Session Timeout

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Login as RM | Session created | ☐ |
| 2 | Wait 28 minutes | Warning shown | ☐ |
| 3 | Check countdown | Timer displays | ☐ |
| 4 | Click "Logout Now" | Immediate logout | ☐ |
| 5 | Check storage | All data cleared | ☐ |
| 6 | Try to access dashboard | Redirect to login | ☐ |

### Test Case 6.3: Concurrent Sessions

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Login in Browser A | Session A active | ☐ |
| 2 | Login in Browser B | Session B active | ☐ |
| 3 | Perform action in A | Works normally | ☐ |
| 4 | Check B | Session still valid | ☐ |
| 5 | Logout from A | Session A ends | ☐ |
| 6 | Check B | Session B still valid | ☐ |

### Test Case 6.4: Data Security

| Step | Action | Expected Result | Status |
|------|--------|----------------|--------|
| 1 | Fill sensitive data | Data in form | ☐ |
| 2 | Check localStorage | Encrypted/secure | ☐ |
| 3 | Logout | Data cleared | ☐ |
| 4 | Check browser storage | Empty | ☐ |
| 5 | Reopen application | No sensitive data | ☐ |

---

## 📱 Responsive Design Testing

### Viewport Sizes to Test

| Device | Width | Height | Test Focus | Status |
|--------|-------|--------|------------|--------|
| iPhone SE | 375 | 667 | Basic mobile | ☐ |
| iPhone 12 | 390 | 844 | Modern mobile | ☐ |
| iPad Mini | 768 | 1024 | Tablet portrait | ☐ |
| iPad Pro | 1024 | 1366 | Tablet landscape | ☐ |
| Desktop | 1920 | 1080 | Full desktop | ☐ |

### Mobile-Specific Tests

- [ ] Touch targets ≥ 44x44px
- [ ] No horizontal scroll
- [ ] Text readable without zoom
- [ ] Forms fillable on mobile
- [ ] Camera/photo capture works
- [ ] Keyboard doesn't hide inputs
- [ ] Bottom navigation accessible
- [ ] Pull-to-refresh not interfering
- [ ] Double-tap zoom disabled
- [ ] Mobile menu works

---

## ♿ Accessibility Testing

### WCAG 2.1 AA Compliance

| Category | Test | Expected Result | Status |
|----------|------|----------------|--------|
| **Images** | Alt text present | All images have alt | ☐ |
| **Forms** | Labels present | All inputs labeled | ☐ |
| **Color** | Contrast ratio | ≥ 4.5:1 text, 3:1 large | ☐ |
| **Keyboard** | Tab navigation | All elements accessible | ☐ |
| **Screen Reader** | ARIA labels | Proper announcements | ☐ |
| **Focus** | Focus visible | Clear focus indicators | ☐ |
| **Error** | Error messages | Associated with inputs | ☐ |
| **Links** | Skip to content | Link available | ☐ |

### Keyboard Navigation Tests

- [ ] Tab through all interactive elements
- [ ] Shift+Tab for reverse navigation
- [ ] Enter/Space to activate buttons
- [ ] Escape to close modals
- [ ] Arrow keys for dropdowns
- [ ] Focus visible on all elements
- [ ] No keyboard traps
- [ ] Logical tab order

---

## ⚡ Performance Testing

### Load Time Targets

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| First Contentful Paint | < 1.5s | ___ | ☐ |
| Largest Contentful Paint | < 2.5s | ___ | ☐ |
| Time to Interactive | < 3.0s | ___ | ☐ |
| Cumulative Layout Shift | < 0.1 | ___ | ☐ |
| First Input Delay | < 100ms | ___ | ☐ |

### Bundle Size Targets

| Bundle | Target | Actual | Status |
|--------|--------|--------|--------|
| Initial JS | < 200KB | ___ | ☐ |
| Initial CSS | < 50KB | ___ | ☐ |
| Total bundles | < 500KB | ___ | ☐ |
| Gzipped | < 150KB | ___ | ☐ |

---

## 🌐 Cross-Browser Testing

### Browsers to Test

| Browser | Version | Status | Notes |
|---------|---------|--------|-------|
| Chrome | Latest | ☐ | Primary browser |
| Safari | Latest | ☐ | iOS + macOS |
| Firefox | Latest | ☐ | Alternative |
| Edge | Latest | ☐ | Windows |
| Samsung Internet | Latest | ☐ | Android |

### Browser-Specific Tests

- [ ] Chrome: All features work
- [ ] Safari: Camera capture works
- [ ] Firefox: Form validation works
- [ ] Edge: Responsive design works
- [ ] Mobile browsers: Touch interactions work

---

## 🐛 Error Scenario Testing

### Network Errors

| Scenario | Action | Expected Result | Status |
|----------|--------|----------------|--------|
| No internet | Submit form | Error message shown | ☐ |
| Slow network | Load page | Loading indicator | ☐ |
| Timeout | API call | Timeout error | ☐ |
| Server error | Submit form | Server error message | ☐ |

### Validation Errors

| Scenario | Action | Expected Result | Status |
|----------|--------|----------------|--------|
| Invalid email | Enter bad email | Email error | ☐ |
| Invalid phone | Enter bad phone | Phone error | ☐ |
| Required field | Leave blank | Required error | ☐ |
| Format error | Wrong format | Format error | ☐ |
| Length error | Too short/long | Length error | ☐ |

### Edge Cases

| Scenario | Action | Expected Result | Status |
|----------|--------|----------------|--------|
| Special characters | In name field | Handled correctly | ☐ |
| Very long text | In text field | Truncated/validated | ☐ |
| Unicode characters | In name field | Displayed correctly | ☐ |
| Copy-paste | Paste data | Works correctly | ☐ |
| Autocomplete | Browser autofill | Works or disabled | ☐ |

---

## 📊 Test Execution Log

### Test Run Information

**Date:** ___________
**Tester:** ___________
**Environment:** ☐ Dev | ☐ Staging | ☐ Prod
**Browser:** ___________
**Device:** ___________

### Test Results Summary

| Category | Total | Passed | Failed | Blocked |
|----------|-------|--------|--------|---------|
| Critical Path | | | | |
| Form Flows | | | | |
| Security | | | | |
| Performance | | | | |
| Accessibility | | | | |
| Responsive | | | | |
| **TOTAL** | | | | |

### Bugs Found

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| | | | |

---

## 🚀 Quick Test Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test -- --coverage

# Run specific test file
npm run test -- StepFormWrapper.test.tsx

# Run performance audit
npm run build
npx lighthouse http://localhost:8080 --view

# Run accessibility audit
npx axe http://localhost:8080
```

---

## 📝 Test Report Template

### Test Summary

**Application:** MTB Credit Card Application
**Version:** 1.0
**Test Date:** ___________
**Tester:** ___________

### Executive Summary

**Overall Status:** ☐ PASS | ☐ FAIL | ☐ PARTIAL

**Critical Issues:** _____
**High Priority Issues:** _____
**Medium Priority Issues:** _____
**Low Priority Issues:** _____

### Recommendations

1.
2.
3.

---

**End of Testing Documentation**

For questions or updates, contact the development team.
