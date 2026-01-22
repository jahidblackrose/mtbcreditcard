/**
 * MTB Credit Card Application - Zod Validation Schemas
 * 
 * Comprehensive validation for all form steps.
 */

import { z } from 'zod';

// ============================================
// COMMON VALIDATORS
// ============================================

// Bangladesh NID: 10, 13, or 17 digits
const nidSchema = z.string()
  .refine((val) => /^\d{10}$|^\d{13}$|^\d{17}$/.test(val), {
    message: 'NID must be 10, 13, or 17 digits',
  });

// Bangladesh Mobile: 11 digits starting with 01 (allows 01[3-9]XXXXXXXX)
const bdMobileSchema = z.string()
  .min(11, { message: 'Mobile number must be 11 digits' })
  .max(11, { message: 'Mobile number must be 11 digits' })
  .refine((val) => /^01[3-9]\d{8}$/.test(val), {
    message: 'Enter a valid Bangladesh mobile number (01XXXXXXXXX)',
  });

// Age validation (18+)
const ageValidator = (dateString: string): boolean => {
  const today = new Date();
  const birthDate = new Date(dateString);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 18;
};

// Email validation
const emailSchema = z.string()
  .email({ message: 'Invalid email address' })
  .max(255, { message: 'Email must be less than 255 characters' });

// Name validation (block letters)
const blockLettersNameSchema = z.string()
  .min(2, { message: 'Name must be at least 2 characters' })
  .max(100, { message: 'Name must be less than 100 characters' })
  .regex(/^[A-Z\s.]+$/, { message: 'Name must be in BLOCK LETTERS (A-Z only)' });

// Regular name
const nameSchema = z.string()
  .min(2, { message: 'Name must be at least 2 characters' })
  .max(100, { message: 'Name must be less than 100 characters' })
  .regex(/^[A-Za-z\s.]+$/, { message: 'Name can only contain letters, spaces, and dots' });

// Amount as string
const amountSchema = z.string()
  .regex(/^\d+(\.\d{1,2})?$/, { message: 'Invalid amount format' });

// Date string (ISO format)
const dateStringSchema = z.string()
  .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date' });

// ============================================
// ADDRESS SCHEMA
// ============================================

export const addressSchema = z.object({
  addressLine1: z.string().min(5, 'Address is required').max(200),
  addressLine2: z.string().max(200).optional(),
  city: z.string().min(2, 'City is required').max(50),
  district: z.string().min(2, 'District is required').max(50),
  postalCode: z.string().regex(/^\d{4}$/, 'Postal code must be 4 digits'),
  country: z.string().min(2).max(50).default('Bangladesh'),
});

// ============================================
// STEP 0: PRE-APPLICATION
// ============================================

export const preApplicationSchema = z.object({
  fullName: nameSchema,
  nidNumber: nidSchema,
  dateOfBirth: dateStringSchema.refine(ageValidator, {
    message: 'You must be at least 18 years old to apply',
  }),
  mobileNumber: bdMobileSchema,
  email: emailSchema,
});

// ============================================
// STEP 1: CARD SELECTION
// ============================================

export const cardSelectionSchema = z.object({
  cardNetwork: z.enum(['MASTERCARD', 'VISA', 'UNIONPAY']),
  cardTier: z.enum(['CLASSIC', 'GOLD', 'PLATINUM', 'TITANIUM', 'SIGNATURE', 'WORLD']),
  cardCategory: z.enum(['REGULAR', 'YAQEEN', 'CO_BRANDED']),
  expectedCreditLimit: amountSchema.refine(
    (val) => parseFloat(val) >= 50000,
    { message: 'Minimum credit limit is BDT 50,000' }
  ),
});

// ============================================
// STEP 2: PERSONAL INFORMATION
// ============================================

export const personalInfoSchema = z.object({
  nameOnCard: blockLettersNameSchema,
  nationality: z.string().min(2).max(50).default('Bangladeshi'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  dateOfBirth: dateStringSchema,
  religion: z.enum(['ISLAM', 'HINDUISM', 'CHRISTIANITY', 'BUDDHISM', 'OTHER']),
  fatherName: nameSchema,
  motherName: nameSchema,
  maritalStatus: z.enum(['SINGLE', 'MARRIED']),
  spouseName: nameSchema.optional(),
  spouseProfession: z.string().max(100).optional(),
  nidNumber: nidSchema,
  tin: z.string().regex(/^\d{12}$/, 'TIN must be 12 digits').optional().or(z.literal('')),
  passportNumber: z.string().max(20).optional().or(z.literal('')),
  passportIssueDate: dateStringSchema.optional().or(z.literal('')),
  passportExpiryDate: dateStringSchema.optional().or(z.literal('')),
  permanentAddress: addressSchema,
  presentAddress: addressSchema,
  sameAsPermanent: z.boolean(),
  mailingAddressType: z.enum(['PRESENT', 'PERMANENT', 'OFFICE']),
  mobileNumber: bdMobileSchema,
  email: emailSchema,
  educationalQualification: z.enum(['SSC', 'HSC', 'GRADUATE', 'POST_GRADUATE', 'PHD', 'OTHER']),
}).refine(
  (data) => data.maritalStatus !== 'MARRIED' || (data.spouseName && data.spouseName.length > 0),
  { message: 'Spouse name is required for married applicants', path: ['spouseName'] }
);

// ============================================
// STEP 3: PROFESSIONAL INFORMATION
// ============================================

export const professionalInfoSchema = z.object({
  customerSegment: z.enum(['SALARIED', 'BUSINESS_PERSON', 'SELF_EMPLOYED', 'LANDLORD', 'OTHER']),
  organizationName: z.string().min(2, 'Organization name is required').max(150),
  parentGroup: z.string().max(150).optional().or(z.literal('')),
  department: z.string().max(100).optional().or(z.literal('')),
  designation: z.string().min(2, 'Designation is required').max(100),
  officeAddress: addressSchema,
  lengthOfServiceYears: z.number().min(0).max(50),
  lengthOfServiceMonths: z.number().min(0).max(11),
  totalExperienceYears: z.number().min(0).max(60),
  totalExperienceMonths: z.number().min(0).max(11),
  previousEmployer: z.string().max(150).optional().or(z.literal('')),
  previousDesignation: z.string().max(100).optional().or(z.literal('')),
});

// ============================================
// STEP 4: MONTHLY INCOME
// ============================================

export const salariedIncomeSchema = z.object({
  grossSalary: amountSchema,
  totalDeduction: amountSchema,
  netSalary: amountSchema,
});

export const businessIncomeSchema = z.object({
  grossIncome: amountSchema,
  totalExpenses: amountSchema,
  netIncome: amountSchema,
});

export const additionalIncomeSourceSchema = z.object({
  source: z.string().min(2).max(100),
  amount: amountSchema,
});

export const monthlyIncomeSchema = z.object({
  isSalaried: z.boolean(),
  salariedIncome: salariedIncomeSchema.optional(),
  businessIncome: businessIncomeSchema.optional(),
  additionalIncomeSources: z.array(additionalIncomeSourceSchema).max(3),
}).refine(
  (data) => {
    if (data.isSalaried) {
      return data.salariedIncome !== undefined;
    }
    return data.businessIncome !== undefined;
  },
  { message: 'Income details are required based on your employment type' }
);

// ============================================
// STEP 5: BANK ACCOUNTS (Optional)
// ============================================

export const bankAccountSchema = z.object({
  id: z.string(),
  bankName: z.string().min(2).max(100),
  accountType: z.enum(['SAVINGS', 'CURRENT', 'FDR', 'DPS', 'OTHER']),
  accountNumber: z.string().min(5).max(30),
  branch: z.string().min(2).max(100),
});

export const bankAccountsSchema = z.array(bankAccountSchema).optional();

// ============================================
// STEP 6: CREDIT FACILITIES (Optional)
// ============================================

export const creditFacilitySchema = z.object({
  id: z.string(),
  bankName: z.string().min(2).max(100),
  facilityType: z.enum(['CREDIT_CARD', 'HOME_LOAN', 'CAR_LOAN', 'PERSONAL_LOAN', 'OTHER']),
  accountNumber: z.string().min(5).max(30),
  limit: amountSchema,
  monthlyInstallment: amountSchema,
});

export const creditFacilitiesSchema = z.array(creditFacilitySchema).optional();

// ============================================
// STEP 7: NOMINEE (MPP)
// ============================================

export const nomineeSchema = z.object({
  nomineeName: nameSchema,
  relationship: z.enum(['SPOUSE', 'PARENT', 'SON', 'DAUGHTER', 'OTHER']),
  dateOfBirth: dateStringSchema,
  contactAddress: z.string().min(10).max(300),
  mobileNumber: bdMobileSchema,
  photoUrl: z.string().optional(),
  declarationAccepted: z.boolean().refine((val) => val === true, {
    message: 'You must accept the MPP declaration',
  }),
});

// ============================================
// STEP 8: SUPPLEMENTARY CARD (Optional)
// ============================================

export const supplementaryCardSchema = z.object({
  fullName: nameSchema,
  nameOnCard: blockLettersNameSchema,
  relationship: z.enum(['FATHER', 'MOTHER', 'SON', 'DAUGHTER', 'SPOUSE', 'OTHER']),
  dateOfBirth: dateStringSchema.refine(ageValidator, {
    message: 'Supplementary card holder must be at least 18 years old',
  }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  fatherName: nameSchema,
  motherName: nameSchema,
  spouseName: nameSchema.optional(),
  presentAddress: addressSchema,
  permanentAddress: addressSchema,
  sameAsPermanent: z.boolean(),
  nidOrBirthCertNo: z.string().min(10).max(20),
  tin: z.string().regex(/^\d{12}$/, 'TIN must be 12 digits').optional().or(z.literal('')),
  passportNumber: z.string().max(20).optional().or(z.literal('')),
  passportIssueDate: dateStringSchema.optional().or(z.literal('')),
  passportExpiryDate: dateStringSchema.optional().or(z.literal('')),
  spendingLimitPercentage: z.number().min(1).max(100),
});

// ============================================
// STEP 9: REFERENCES
// ============================================

export const referenceSchema = z.object({
  refereeName: nameSchema,
  relationship: z.enum(['COLLEAGUE', 'FRIEND', 'RELATIVE', 'EMPLOYER', 'OTHER']),
  mobileNumber: bdMobileSchema,
  workAddress: z.string().min(10).max(300),
  residenceAddress: z.string().min(10).max(300),
});

export const referencesSchema = z.object({
  reference1: referenceSchema,
  reference2: referenceSchema,
});

// ============================================
// STEP 10: IMAGE & SIGNATURE
// ============================================

export const imageSignatureSchema = z.object({
  primaryApplicantPhoto: z.string().min(1, 'Primary applicant photo is required'),
  supplementaryApplicantPhoto: z.string().optional(),
  primaryApplicantSignature: z.string().min(1, 'Primary applicant signature is required'),
  supplementaryApplicantSignature: z.string().optional(),
});

// ============================================
// STEP 11: AUTO DEBIT
// ============================================

export const autoDebitSchema = z.object({
  autoDebitPreference: z.enum(['MINIMUM_AMOUNT_DUE', 'TOTAL_OUTSTANDING']),
  accountName: z.string().min(2).max(100),
  mtbAccountNumber: z.string().min(10).max(20),
});

// ============================================
// STEP 12: MID
// ============================================

export const declarationItemSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.boolean().nullable(),
});

export const documentChecklistItemSchema = z.object({
  id: z.string(),
  documentType: z.string(),
  label: z.string(),
  required: z.boolean(),
  uploaded: z.boolean(),
  fileUrl: z.string().optional(),
});

export const midSchema = z.object({
  declarations: z.array(declarationItemSchema).refine(
    (items) => items.every((item) => item.answer !== null),
    { message: 'All declarations must be answered' }
  ),
  documentChecklist: z.array(documentChecklistItemSchema).refine(
    (items) => items.filter((i) => i.required).every((i) => i.uploaded),
    { message: 'All required documents must be uploaded' }
  ),
});

// ============================================
// EXPORT INFERRED TYPES
// ============================================

export type PreApplicationFormData = z.infer<typeof preApplicationSchema>;
export type CardSelectionFormData = z.infer<typeof cardSelectionSchema>;
export type PersonalInfoFormData = z.infer<typeof personalInfoSchema>;
export type ProfessionalInfoFormData = z.infer<typeof professionalInfoSchema>;
export type MonthlyIncomeFormData = z.infer<typeof monthlyIncomeSchema>;
export type NomineeFormData = z.infer<typeof nomineeSchema>;
export type SupplementaryCardFormData = z.infer<typeof supplementaryCardSchema>;
export type ReferencesFormData = z.infer<typeof referencesSchema>;
export type ImageSignatureFormData = z.infer<typeof imageSignatureSchema>;
export type AutoDebitFormData = z.infer<typeof autoDebitSchema>;
export type MIDFormData = z.infer<typeof midSchema>;
