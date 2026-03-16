# Form Step Enhancement Guide

This guide provides instructions and templates for enhancing all 13 form step components with consistent UX patterns.

## Enhanced Components (Completed ✅)

1. **CardSelectionStep** - Step 1: Card Selection
2. **MonthlyIncomeStep** - Step 4: Monthly Income Details
3. **ReferencesStep** - Step 9: References

## Remaining Components to Enhance

4. **PersonalInfoStep** - Step 2: Personal Information
5. **ProfessionalInfoStep** - Step 3: Professional Information
6. **BankAccountsStep** - Step 5: Bank Accounts
7. **CreditFacilitiesStep** - Step 6: Credit Facilities
8. **NomineeStep** - Step 7: Nominee Information
9. **SupplementaryCardStep** - Step 8: Supplementary Card
10. **ImageSignatureStep** - Step 10: Image & Signature Upload
11. **AutoDebitStep** - Step 11: Auto Debit Setup
12. **MIDStep** - Step 12: MID Declarations
13. **DeclarationSubmitStep** - Step 13: Final Declaration & Submit

## Enhancement Template

### 1. Import Required Components

```tsx
import { StepFormWrapper, FormSection, FieldRow, FieldTripleRow } from '@/components';
import { YourSpecificIcons } from 'lucide-react';
```

### 2. Wrap with StepFormWrapper

**Before:**
```tsx
return (
  <Form {...form}>
    <form className="space-y-6" onChange={handleFieldChange}>
      {/* content */}
    </form>
  </Form>
);
```

**After:**
```tsx
return (
  <StepFormWrapper
    stepNumber={X}
    title="Step Title"
    description="Brief description of what this step collects"
    hint="Optional helpful information for users"
  >
    <Form {...form}>
      <form className="space-y-6" onChange={handleFieldChange}>
        {/* content */}
      </form>
    </Form>
  </StepFormWrapper>
);
```

### 3. Use FormSection for Grouping

**Before:**
```tsx
<div className="space-y-4">
  <h3 className="text-lg font-semibold">Section Title</h3>
  {/* fields */}
</div>
```

**After:**
```tsx
<FormSection
  title="Section Title"
  description="Optional description"
  icon={<YourIcon className="h-5 w-5" />}
>
  {/* fields */}
</FormSection>
```

### 4. Use FieldRow for 2-Column Layouts

**Before:**
```tsx
<div className="grid gap-4 sm:grid-cols-2">
  {/* fields */}
</div>
```

**After:**
```tsx
<FieldRow>
  {/* fields */}
</FieldRow>
```

## Step-Specific Enhancement Instructions

### Step 2: PersonalInfoStep

**Key Sections:**
- Basic Information (Name, Nationality, Gender, DOB)
- Family Information (Father, Mother, Spouse)
- Contact Information (Mobile, Email, Addresses)
- ID Information (NID, Passport, TIN)

**Enhancement Priority:** HIGH - Complex form with many fields

**Hint Text:**
```
"Please ensure all information matches your National ID card. Your address will be used for card delivery."
```

### Step 3: ProfessionalInfoStep

**Key Sections:**
- Employment Details
- Office Address
- Employment Duration

**Hint Text:**
```
"Your employment information helps us verify your income stability. Please provide accurate current employment details."
```

### Step 5: BankAccountsStep

**Key Sections:**
- Existing Bank Accounts
- Account Details

**Hint Text:**
```
"Please provide your primary bank account details. This will be used for auto-debit setup if you choose this option."
```

### Step 6: CreditFacilitiesStep

**Key Sections:**
- Existing Credit Cards
- Loan Facilities

**Hint Text:**
```
"Information about existing credit facilities helps us assess your creditworthiness. This includes credit cards from any bank."
```

### Step 7: NomineeStep

**Key Sections:**
- Nominee Personal Details
- Nominee Address
- Nominee Relationship

**Hint Text:**
```
"A nominee is someone who will receive your credit card benefits in case of unforeseen circumstances. This is required for all applicants."
```

### Step 8: SupplementaryCardStep

**Key Sections:**
- Supplementary Card Decision
- Supplementary Cardholder Details

**Hint Text:**
```
"Supplementary cards allow family members to share your credit limit. They will receive their own card but share your account."
```

### Step 10: ImageSignatureStep

**Key Sections:**
- Photo Upload
- Signature Upload
- Supplementary Photo (if applicable)

**Hint Text:**
```
"Please ensure your photo is clear, recent, and taken against a plain background. Your signature should be on white paper."
```

### Step 11: AutoDebitStep

**Key Sections:**
- Auto Debit Enrollment
- Bank Account Selection
- Debit Amount

**Hint Text:**
```
"Auto-debit ensures you never miss a payment. We'll automatically deduct the minimum amount due from your selected account."
```

### Step 12: MIDStep

**Key Sections:**
- MID Declarations
- Document Checklist

**Hint Text:**
```
"Please review all declarations carefully. These are regulatory requirements for all credit card applicants."
```

### Step 13: DeclarationSubmitStep

**Key Sections:**
- Final Review
- Terms Acceptance
- Live Photo Capture
- Submit Application

**Hint Text:**
```
"Please review all information before submitting. Once submitted, you cannot make changes without contacting customer service."
```

## Common Patterns

### Adding Icons to FormSections

```tsx
import { User, Building2, MapPin, Phone, Mail, CreditCard } from 'lucide-react';

<FormSection title="Personal Information" icon={<User className="h-5 w-5" />}>
  {/* fields */}
</FormSection>

<FormSection title="Contact Details" icon={<Phone className="h-5 w-5" />}>
  {/* fields */}
</FormSection>
```

### Enhanced Validation Messages

```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label *</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormDescription>
        Helpful description text
      </FormDescription>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Responsive 3-Column Layouts

```tsx
<FieldTripleRow>
  <FormField name="field1">{/* ... */}</FormField>
  <FormField name="field2">{/* ... */}</FormField>
  <FormField name="field3">{/* ... */}</FormField>
</FieldTripleRow>
```

## Testing Checklist

After enhancing each step, verify:

- [ ] Step number displays correctly
- [ ] Title and description are clear
- [ ] Hint text is helpful (if applicable)
- [ ] All form fields have proper labels
- [ ] Required fields are marked with asterisk (*)
- [ ] Validation messages are specific and actionable
- [ ] Sections have icons (optional but recommended)
- [ ] Mobile layout works correctly
- [ ] Auto-save functionality works
- [ ] Form scrolls to first error on validation failure
- [ ] Loading states work properly

## File Locations

All step files are located at:
```
src/ui/application/components/steps/
```

## Helper Components Location

Helper components are located at:
```
src/components/
├── StepHeader.tsx
├── StepFormWrapper.tsx
└── FormFieldWrapper.tsx
```

## Progress Tracking

- ✅ Step 1: CardSelectionStep
- ⏳ Step 2: PersonalInfoStep
- ⏳ Step 3: ProfessionalInfoStep
- ✅ Step 4: MonthlyIncomeStep
- ⏳ Step 5: BankAccountsStep
- ⏳ Step 6: CreditFacilitiesStep
- ⏳ Step 7: NomineeStep
- ⏳ Step 8: SupplementaryCardStep
- ✅ Step 9: ReferencesStep
- ⏳ Step 10: ImageSignatureStep
- ⏳ Step 11: AutoDebitStep
- ⏳ Step 12: MIDStep
- ⏳ Step 13: DeclarationSubmitStep

## Next Steps

1. Continue enhancing remaining steps following the template
2. Test each enhanced step thoroughly
3. Ensure consistent UX across all steps
4. Verify accessibility (WCAG 2.1 AA compliance)
5. Test on mobile and desktop devices

---

**Note:** All enhanced components should maintain the existing form validation schemas and data structures. Only UX and presentation should change.
