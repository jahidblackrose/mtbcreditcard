# MTB Credit Card Application - Testing Checklist

## End-to-End Testing Checklist

### Test Environment Setup
- [ ] Development environment (MOCK mode) configured
- [ ] All environment variables set correctly
- [ ] Browser dev tools available
- [ ] Network throttling enabled for slow 3G testing
- [ ] Screen reader installed (NVDA/JAWS) for accessibility testing

---

## Flow 1: New Application (SELF Mode)

### Pre-Application
- [ ] Landing page loads without errors
- [ ] "Apply Now" button is visible and functional
- [ ] Mode selection screen displays correctly
- [ ] SELF mode can be selected

### Onboarding
- [ ] Pre-application form displays
- [ ] Mobile number input accepts 11 digits
- [ ] OTP verification screen appears
- [ ] OTP can be entered (MOCK: use any 6-digit code)
- [ ] Successful OTP leads to application form

### Step-by-Step Form Navigation
- [ ] Step 1: Card Selection
  - [ ] Card network selection works (Mastercard/Visa/UnionPay)
  - [ ] Card tier selection works
  - [ ] Card category selection works
  - [ ] Credit limit input accepts numeric values
  - [ ] Min validation (50,000) works
  - [ ] Next button enables when valid

- [ ] Step 2: Personal Information
  - [ ] Name on card auto-converts to uppercase
  - [ ] Nationality defaults to Bangladeshi
  - [ ] Gender selection works
  - [ ] Date of birth picker works
  - [ ] Age validation (18+) works
  - [ ] Religion selection works
  - [ ] Father's name is required
  - [ ] Mother's name is required
  - [ ] Spouse name appears when Married selected
  - [ ] NID number validation works
  - [ ] District dropdown works
  - [ ] Thana dropdown updates based on district
  - [ ] Same as permanent checkbox works
  - [ ] Address fields validate correctly

- [ ] Step 3: Professional Information
  - [ ] Customer segment selection works
  - [ ] Organization name is required
  - [ ] Designation is required
  - [ ] Office address fields work
  - [ ] Length of service (years/months) works
  - [ ] Total experience (years/months) works

- [ ] Step 4: Monthly Income
  - [ ] Employment type toggle works (Salaried/Business)
  - [ ] Salaried income fields appear when selected
  - [ ] Business income fields appear when selected
  - [ ] Gross salary/income validation works
  - [ ] Net salary/income calculates correctly
  - [ ] Additional income can be added/removed

- [ ] Step 5: Bank Accounts
  - [ ] "Add Account" button works
  - [ ] Account form displays
  - [ ] Bank name is required
  - [ ] Account type selection works
  - [ ] Account number validation works
  - [ ] Branch is required
  - [ ] Account can be removed
  - [ ] Empty state displays correctly
  - [ ] Section is optional (can skip)

- [ ] Step 6: Credit Facilities
  - [ ] "Add Facility" button works
  - [ ] Facility type selection works
  - [ ] Bank name is required
  - [ ] Account number validation works
  - [ ] Credit limit validation works
  - [ ] Monthly installment validation works
  - [ ] Facility can be removed
  - [ ] Empty state displays correctly
  - [ ] Section is optional (can skip)

- [ ] Step 7: Nominee Information
  - [ ] Nominee name is required
  - [ ] Relationship selection works
  - [ ] Date of birth picker works
  - [ ] Address is required
  - [ ] Mobile number validation works
  - [ ] Photo capture works (MOCK: simulated)
  - [ ] Declaration checkbox is required
  - [ ] Validation prevents proceeding without acceptance

- [ ] Step 8: Supplementary Card
  - [ ] "Add Supplementary Card" invitation displays
  - [ ] Can decline supplementary card
  - [ ] When accepted, full form displays
  - [ ] Full name is required
  - [ ] Name on card max 22 characters enforced
  - [ ] Relationship checkboxes work (single selection)
  - [ ] Date of birth picker works
  - [ ] Gender selection works
  - [ ] Parents' names are required
  - [ ] Address fields are required
  - [ ] NID/Birth Certificate validation works
  - [ ] Mobile validation works
  - [ ] Email validation works
  - [ ] Passport fields work (optional)
  - [ ] Spending limit slider works
  - [ ] Can remove supplementary card

- [ ] Step 9: References
  - [ ] Reference 1 form displays
  - [ ] Referee name is required
  - [ ] Relationship selection works
  - [ ] Mobile validation works
  - [ ] Address fields are required
  - [ ] Reference 2 form displays
  - [ ] Both references must be filled

- [ ] Step 10: Photo & Signature
  - [ ] Primary applicant photo section displays
  - [ ] Photo capture works (MOCK: simulated)
  - [ ] Signature capture works (MOCK: simulated)
  - [ ] Supplementary photo displays if applicable
  - ] Supplementary signature displays if applicable

- [ ] Step 11: Auto Debit
  - [ ] Auto debit preference selection works
  - [ ] Account name field is required if enrolled
  - [ ] MTB account number is required if enrolled
  - [ ] Can skip auto debit

- [ ] Step 12: MID Declarations
  - [ ] All 6 declarations display
  - [ ] Yes/No selection works for each
  - [ ] Progress indicator shows completion
  - [ ] Document checklist displays
  - [ ] Required documents are marked
  - [ ] Upload buttons work (MOCK: simulated)
  - [ ] Cannot submit without all required documents

- [ ] Step 13: Declaration & Submit
  - [ ] Terms and conditions display
  - [ ] Declaration text displays
  - [ ] Live photo capture works (MOCK: simulated)
  - [ ] Terms acceptance checkbox is required
  - [ ] Declaration acceptance checkbox is required
  - [ ] Submit button enables only when all complete
  - [ ] Submission shows loading state
  - [ ] Success screen displays after submission
  - [ ] Reference number is generated
  - [ ] Success screen shows applicant details
  - [ ] "Go Home" button works

### Navigation & Save States
- [ ] Back button works on all steps
- [ ] Next button validation works
- [ ] Can skip optional steps
- [ ] Progress indicator updates correctly
- [ ] Save status indicator shows "Saving..."
- [ ] Save status indicator shows "Saved"
- [ ] Draft is auto-saved on field changes

### Session Management
- [ ] Session expiry warning appears (2 min before)
- [ ] "Extend Session" button works
- [ ] Auto-logout happens when session expires
- [ ] Error message displays if session expires
- [ ] Can re-login and resume

### Error Handling
- [ ] Validation errors display clearly
- [ ] Error messages are specific and actionable
- [ ] Scroll to first error on validation failure
- [ ] Required fields are marked with asterisk
- [ ] Invalid fields are highlighted
- [ ] Field-level error messages display

### Responsive Design
- [ ] All steps work on mobile (≤768px)
- [ ] All steps work on tablet (768px-1024px)
- [ ] All steps work on desktop (>1024px)
- [ ] Touch targets are at least 44x44px
- [ ] Form fields are usable on mobile
- [ ] Date picker works on mobile
- [ ] File upload works on mobile (if applicable)

---

## Flow 2: New Application (ASSISTED Mode)

### RM Login
- [ ] RM login page loads
- [ ] Staff ID field works
- [ ] Password field works (show/hide)
- [ ] "Remember me" checkbox works
- [ ] "Forgot Password" link displays (MOCK flow)
- [ ] Login validation works
- [ ] Error message displays on invalid credentials
- [ ] Successful login redirects to RM Dashboard

### Assisted Application
- [ ] RM Dashboard displays with statistics
- [ ] "New Application" button works
- [ ] Application form loads in ASSISTED mode
- [ ] ASSISTED badge displays in header
- [ ] All form steps work (same as SELF mode)
- [ ] RM can see and help fill the form

### Session Management
- [ ] RM session is maintained
- [ ] Session expiry warning works
- [ ] Logout button works
- [ ] Logout clears sensitive data

---

## Flow 3: Resume Draft Application

### Resume Dashboard
- [ ] "Resume Application" option works
- [ ] Mobile number input accepts 11 digits
- [ ] "Find My Applications" button works
- [ ] Loading state displays during search
- [ ] Application list displays if applications found
- [ ] Empty state displays if no applications found
- [ ] "Create New Application" button works

### Application List
- [ ] Application cards display correctly
- [ ] Card product name shows
- [ ] Reference number shows
- [ ] Applicant name shows
- [ ] Status badge displays with correct color
- [ ] Last updated date shows
- [ ] Draft applications show progress bar
- [ ] Progress percentage is correct
- [ ] "Resume Application" button works for drafts
- [ ] "View Status" button works for submitted applications

### Resuming Draft
- [ ] Clicking resume loads the draft
- [ ] All pre-filled data displays correctly
- [ ] Can continue from where left off
- [ ] Progress indicator shows correct step
- [ ] Can edit all fields

---

## Flow 4: Track Application Status

### Track from Dashboard
- [ ] "Track Application" card displays on dashboard
- [ ] Reference number input works
- [ ] "Track" button works
- [ ] Loading state displays during search
- [ ] Application status displays if found
- [ ] Error message displays if not found

### Status Tracker
- [ ] Application summary card displays
  - [ ] Reference number shows
  - [ ] Applicant name shows
  - [ ] Card product shows
  - [ ] Current status badge shows
  - [ ] Submitted date shows
  - [ ] Last updated date shows

- [ ] Timeline displays
  - [ ] All timeline events display
  - [ ] Events are in chronological order
  - [ ] Icons display correctly for each status
  - [ ] Current step is highlighted
  - [ ] Completed steps show checkmarks
  - [ ] Pending steps show gray
  - [ ] Timestamps show correctly
  - [ ] Actor information displays

- [ ] Contact support section displays
  - [ ] Email address shows
  - [ ] Phone number shows
  - [ ] Links are clickable

### Download Status
- [ ] "Download Status" button works
- [ ] Loading state shows during download
- - [ ] PDF downloads (or shows success message in MOCK)

---

## Flow 5: Add Supplementary Card (Existing Customer)

### Supplementary Flow
- [ ] "Add Supplementary Card" option works
- [ ] Explanation screen displays
- [ ] Supplementary card form loads
- [ ] All fields work (same as main application step 8)
- [ ] Submit button works
- [ ] Confirmation displays

---

## Flow 6: Session Management

### Session Warning
- [ ] Warning banner appears 2 minutes before expiry
- [ ] Countdown timer shows correctly
- [ ] "Extend Session" button works
- [ ] Extension success message displays
- [ ] Extension failure message displays

### Session Expiry
- [ ] Auto-logout happens when session expires
- [ ] Clear message explains session expired
- [ ] "Login Again" button works
- [ ] Redirects to correct login page

### Data Clearing
- [ ] All sensitive data cleared on logout
- [ ] Session storage cleared
- [ ] Form data cleared
- [ ] Cannot access protected pages after logout

---

## Component Testing

### ApplicationHeader
- [ ] Step number displays correctly
- [ ] Step title displays correctly
- [ ] Progress bar fills correctly
- [ ] Save status shows "Saving..."
- [ ] Save status shows "Saved X ago"
- [ ] Application ID displays (if available)
- [ ] Mode badge displays with correct color
- [ ] Sticky header works on desktop
- [ ] Mobile version shows step dots

### StepNavigation
- [ ] Back button works (when allowed)
- [ ] Back button disabled on step 1
- [ ] Next/Submit button works
- [ ] Button text changes to "Submit" on final step
- [ ] "Save Draft" button works (when shown)
- [ ] Buttons disabled during loading
- [ ] Validation errors display in banner
- [ ] Progress dots work on mobile
- [ ] Buttons have correct hover/focus states

### Skeleton Loading
- [ ] ApplicationCardSkeleton displays correctly
- [ ] FormSkeleton displays correctly
- [ ] TableSkeleton displays correctly
- [ ] Animation is smooth
- [ ] Loading states transition smoothly

### TimelineCard
- [ ] Timeline displays correctly
- [ ] Events are ordered chronologically
- [ ] Current event is highlighted
- [ ] Completed events show checkmarks
- [ ] Icons display correctly
- [ ] Timestamps format correctly
- [ ] Actor badges display correctly

### EmptyState
- [ ] Icon displays correctly
- [ ] Title displays correctly
- [ ] Description displays correctly
- [ ] Action button works
- [ ] Styling is consistent

---

## Cross-Browser Testing

### Chrome (Latest)
- [ ] All flows work end-to-end
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] All features work

### Firefox (Latest)
- [ ] All flows work end-to-end
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] All features work

### Safari (iOS + Mac)
- [ ] All flows work end-to-end
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Touch gestures work on iOS
- [ ] Date picker works

### Edge (Latest)
- [ ] All flows work end-to-end
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] All features work

---

## Accessibility Testing (WCAG 2.1 AA)

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Skip to content links work
- [ ] Modal focus trap works
- [ ] Escape key closes modals
- [ ] Arrow keys work in dropdowns

### Screen Reader
- [ ] All images have alt text
- [ ] Form fields have labels
- [ ] Error messages are announced
- [ ] Status changes are announced
- [ ] ARIA labels are correct
- [ ] Live regions announce dynamic changes

### Color Contrast
- [ ] All text meets WCAG AA contrast (4.5:1)
- [ ] Large text meets WCAG AA contrast (3:1)
- [ ] UI components have sufficient contrast
- [ ] Focus indicators are visible

### Touch Targets
- [ ] All buttons are at least 44x44px
- [ ] All links are at least 44x44px
- [ ] Form inputs are large enough
- [ ] Spacing between interactive elements

---

## Security Testing

### Input Validation
- [ ] All inputs are sanitized
- [ ] XSS prevention works
- [ ] SQL injection prevention works
- [ ] File upload restrictions work
- [ ] File type validation works
- [ ] File size validation works

### Authentication
- [ ] Password requirements are enforced
- [ ] Session tokens are secure
- [ ] Logout clears all data
- [ ] Session expiry works correctly
- [ ] Rate limiting works (OTP, login)

### Data Protection
- [ ] Sensitive data is encrypted at rest
- [ ] Sensitive data is encrypted in transit (HTTPS)
- [ ] No sensitive data in localStorage
- [ ] No sensitive data in URLs
- [ ] No sensitive data in console logs

### CSRF Protection
- [ ] CSRF tokens are used
- [ ] SameSite cookie attribute is set
- [ ] Origin headers are validated

---

## Performance Testing

### Load Time
- [ ] Initial page load < 3 seconds
- [ ] Time to Interactive < 3 seconds
- [ ] First Contentful Paint < 1.5 seconds
- [ ] Largest Contentful Paint < 2.5 seconds

### Runtime Performance
- [ ] Animations are smooth (60fps)
- [ ] No layout shifts
- [ ] No memory leaks
- [ ] No unnecessary re-renders
- [ ] Lazy loading works

### Bundle Size
- [ ] Initial JS bundle < 200KB
- [ ] Total bundle size < 500KB
- [ ] Code splitting works
- [ ] Tree shaking works
- [ ] No unused dependencies

---

## Device Testing

### Mobile (iOS Safari, Android Chrome)
- [ ] All flows work
- [ ] Touch gestures work
- [ ] Virtual keyboard doesn't break layout
- [ ] Date picker works
- [ ] File upload works
- [ ] Camera capture works (if applicable)

### Tablet (iPad, Android Tablets)
- [ ] All flows work
- [ ] Touch and keyboard both work
- [ ] Layout adapts correctly
- [ ] Orientation changes work

### Desktop (1920x1080)
- [ ] All flows work
- [ ] Maximum width is respected
- [ ] Images are sharp
- [ ] Fonts render correctly

---

## Error Scenarios

### Network Errors
- [ ] Network timeout handled gracefully
- [ ] Offline message displays
- [ ] Retry option available
- [ ] Data is not lost on network error

### Server Errors
- [ ] 500 errors handled gracefully
- [ ] Error message is user-friendly
- [ ] Recovery option available
- [ ] Data is preserved

### Validation Errors
- [ ] All validations work correctly
- [ ] Error messages are clear
- [ ] Multiple errors can be fixed one at a time
- [ ] Form doesn't submit with errors

---

## Final Checklist

### Must Pass
- [ ] All 6 main flows work end-to-end
- [ ] No console errors
- [ ] Mobile and desktop both work
- [ ] Session management works
- [ ] All validations work
- [ ] Accessibility passes WCAG AA
- [ ] Performance is acceptable

### Should Pass
- [ ] Cross-browser compatible
- [ ] Touch gestures smooth
- [ ] Animations are smooth
- [ ] Loading states are helpful
- [ ] Error messages are clear
- [ ] Empty states are helpful

### Nice to Have
- [ ] PWA features work
- [ ] Offline support
- [ ] Dark mode works
- [ ] Animations are delightful
- [ ] Micro-interactions provide feedback

---

## Testing Notes

### Test Data (MOCK Mode)
- **RM Login:**
  - Staff ID: admin, rm001, rm002, verifier
  - Password: admin123 (admin) or password (others)

- **OTP:** Any 6-digit code (e.g., 123456)

- **Mobile Numbers:** 01XXXXXXXXX (11 digits starting with 01)

- **NID:** 10 or 13 digits

### Known Issues (Workarounds)
- [ ] Camera capture is MOCK - simulates capture after 2 seconds
- [ ] File upload is MOCK - simulates upload
- [ ] API calls return MOCK data
- [ ] Email/SMS not actually sent in MOCK mode

---

**Test Environment:** Development (MOCK mode)
**Browsers Tested:** Chrome, Firefox, Safari, Edge
**Devices Tested:** Desktop, iPhone 12, iPad, Android Phone
**Accessibility Tools:** NVDA, WAVE, Lighthouse
