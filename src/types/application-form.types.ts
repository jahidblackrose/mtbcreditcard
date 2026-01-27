/**
 * MTB Credit Card Application - Comprehensive Form Types
 * 
 * All money and amounts are treated as STRING for precision.
 * Types match the official MTB Credit Card Application Form layout.
 */

// ============================================
// ENUMS & CONSTANTS
// ============================================

export type ApplicationMode = 'SELF' | 'ASSISTED';

export type ApplicationStatus = 
  | 'DRAFT'
  | 'PENDING_OTP'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'DOCUMENTS_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CARD_ISSUED';

// Card Types
export type CardNetwork = 'MASTERCARD' | 'VISA' | 'UNIONPAY';
export type CardTier = 'CLASSIC' | 'GOLD' | 'PLATINUM' | 'TITANIUM' | 'SIGNATURE' | 'WORLD';
export type CardCategory = 'REGULAR' | 'YAQEEN' | 'CO_BRANDED';

// Personal Info
export type Gender = 'MALE' | 'FEMALE' | 'OTHER';
export type MaritalStatus = 'SINGLE' | 'MARRIED';
export type Religion = 'ISLAM' | 'HINDUISM' | 'CHRISTIANITY' | 'BUDDHISM' | 'OTHER';
export type EducationLevel = 'SSC' | 'HSC' | 'GRADUATE' | 'POST_GRADUATE' | 'PHD' | 'OTHER';

// Professional Info
export type CustomerSegment = 
  | 'SALARIED'
  | 'BUSINESS_PERSON'
  | 'SELF_EMPLOYED'
  | 'LANDLORD'
  | 'OTHER';

// Banking
export type AccountType = 'SAVINGS' | 'CURRENT' | 'FDR' | 'DPS' | 'OTHER';
export type FacilityType = 'CREDIT_CARD' | 'HOME_LOAN' | 'CAR_LOAN' | 'PERSONAL_LOAN' | 'OTHER';

// Document Types
export type DocumentType = 
  | 'NID'
  | 'PASSPORT'
  | 'TIN_CERTIFICATE'
  | 'SALARY_SLIP'
  | 'BANK_STATEMENT'
  | 'UTILITY_BILL'
  | 'PHOTOGRAPH'
  | 'SIGNATURE'
  | 'NOMINEE_PHOTO'
  | 'TRADE_LICENSE'
  | 'OTHER';

// Relationship Types
export type NomineeRelationship = 'SPOUSE' | 'PARENT' | 'SON' | 'DAUGHTER' | 'OTHER';
export type SupplementaryRelationship = 'FATHER' | 'MOTHER' | 'SON' | 'DAUGHTER' | 'SPOUSE' | 'OTHER';
export type RefereeRelationship = 'COLLEAGUE' | 'FRIEND' | 'RELATIVE' | 'EMPLOYER' | 'OTHER';

// Address Type for mailing preference
export type MailingAddressType = 'PRESENT' | 'PERMANENT' | 'OFFICE';

// ============================================
// STEP 0: PRE-APPLICATION / ONBOARDING
// ============================================

export interface PreApplicationData {
  fullName: string;
  nidNumber: string; // 10, 13, or 17 digits
  dateOfBirth: string; // ISO date string
  mobileNumber: string; // 11 digits, starts with 01
  email: string;
}

// ============================================
// STEP 1: CARD & CREDIT LIMIT DETAILS
// ============================================

export interface CardSelectionData {
  cardNetwork: CardNetwork;
  cardTier: CardTier;
  cardCategory: CardCategory;
  expectedCreditLimit: string; // Amount as string
}

// ============================================
// STEP 2: PERSONAL INFORMATION
// ============================================

export interface AddressData {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
}

export interface PersonalInfoData {
  nameOnCard: string; // BLOCK LETTERS
  nationality: string;
  homeDistrict: string; // Searchable district selection
  gender: Gender;
  dateOfBirth: string;
  religion: Religion;
  fatherName: string;
  motherName: string;
  maritalStatus: MaritalStatus;
  spouseName?: string;
  spouseProfession?: string;
  nidNumber: string;
  tin?: string;
  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  permanentAddress: AddressData;
  presentAddress: AddressData;
  sameAsPermanent: boolean;
  mailingAddressType: MailingAddressType;
  mobileNumber: string;
  email: string;
  educationalQualification: EducationLevel;
}

// ============================================
// STEP 3: PROFESSIONAL INFORMATION
// ============================================

export interface ProfessionalInfoData {
  customerSegment: CustomerSegment;
  organizationName: string;
  parentGroup?: string;
  department?: string;
  designation: string;
  officeAddress: AddressData;
  lengthOfServiceYears: number;
  lengthOfServiceMonths: number;
  totalExperienceYears: number;
  totalExperienceMonths: number;
  previousEmployer?: string;
  previousDesignation?: string;
}

// ============================================
// STEP 4: MONTHLY INCOME DETAILS
// ============================================

export interface SalariedIncomeData {
  grossSalary: string;
  totalDeduction: string;
  netSalary: string;
}

export interface BusinessIncomeData {
  grossIncome: string;
  totalExpenses: string;
  netIncome: string;
}

export interface AdditionalIncomeSource {
  source: string;
  amount: string;
}

export interface MonthlyIncomeData {
  isSalaried: boolean;
  salariedIncome?: SalariedIncomeData;
  businessIncome?: BusinessIncomeData;
  additionalIncomeSources: AdditionalIncomeSource[];
}

// ============================================
// STEP 5: BANKING ACTIVITY - ACCOUNTS (Optional)
// ============================================

export interface BankAccountData {
  id: string;
  bankName: string;
  accountType: AccountType;
  accountNumber: string;
  branch: string;
}

// ============================================
// STEP 6: BANKING ACTIVITY - CREDIT/LOANS (Optional)
// ============================================

export interface CreditFacilityData {
  id: string;
  bankName: string;
  facilityType: FacilityType;
  accountNumber: string; // Credit Card No or Loan Account No
  limit: string;
  monthlyInstallment: string;
}

// ============================================
// STEP 7: MTB PROTECTION PLAN (MPP)
// ============================================

export interface NomineeData {
  nomineeName: string;
  relationship: NomineeRelationship;
  dateOfBirth: string;
  contactAddress: string;
  mobileNumber: string;
  photoUrl?: string;
  declarationAccepted: boolean;
}

// ============================================
// STEP 8: SUPPLEMENTARY CARD (Optional)
// ============================================

export interface SupplementaryCardData {
  fullName: string;
  nameOnCard: string;
  relationship: SupplementaryRelationship;
  dateOfBirth: string;
  gender: Gender;
  fatherName: string;
  motherName: string;
  spouseName?: string;
  presentAddress: AddressData;
  permanentAddress: AddressData;
  sameAsPermanent: boolean;
  nidOrBirthCertNo: string;
  tin?: string;
  passportNumber?: string;
  passportIssueDate?: string;
  passportExpiryDate?: string;
  spendingLimitPercentage: number; // 1-100
}

// ============================================
// STEP 9: REFERENCES (Mandatory - Two)
// ============================================

export interface ReferenceData {
  refereeName: string;
  relationship: RefereeRelationship;
  mobileNumber: string;
  workAddress: string;
  residenceAddress: string;
}

export interface ReferencesData {
  reference1: ReferenceData;
  reference2: ReferenceData;
}

// ============================================
// STEP 10: IMAGE & SIGNATURE UPLOAD
// ============================================

export interface ImageSignatureData {
  primaryApplicantPhoto?: string; // URL or base64
  supplementaryApplicantPhoto?: string;
  primaryApplicantSignature?: string;
  supplementaryApplicantSignature?: string;
}

// ============================================
// STEP 11: AUTO DEBIT INSTRUCTION
// ============================================

export type AutoDebitPreference = 'MINIMUM_AMOUNT_DUE' | 'TOTAL_OUTSTANDING';

export interface AutoDebitData {
  autoDebitPreference: AutoDebitPreference;
  accountName: string;
  mtbAccountNumber: string;
}

// ============================================
// STEP 12: MOST IMPORTANT DOCUMENT (MID)
// ============================================

export interface DeclarationItem {
  id: string;
  question: string;
  answer: boolean | null;
}

export interface DocumentChecklistItem {
  id: string;
  documentType: DocumentType;
  label: string;
  required: boolean;
  uploaded: boolean;
  fileUrl?: string;
}

export interface MIDData {
  declarations: DeclarationItem[];
  documentChecklist: DocumentChecklistItem[];
}

// ============================================
// COMPLETE APPLICATION DATA
// ============================================

export interface FullApplicationData {
  // Meta
  id?: string;
  referenceNumber?: string;
  mode: ApplicationMode;
  status: ApplicationStatus;
  currentStep: number;
  
  // Pre-application
  preApplication: PreApplicationData;
  otpVerified: boolean;
  
  // All Steps
  cardSelection: CardSelectionData;
  personalInfo: PersonalInfoData;
  professionalInfo: ProfessionalInfoData;
  monthlyIncome: MonthlyIncomeData;
  bankAccounts: BankAccountData[];
  creditFacilities: CreditFacilityData[];
  nominee: NomineeData;
  supplementaryCard?: SupplementaryCardData;
  hasSupplementaryCard: boolean;
  references: ReferencesData;
  imageSignature: ImageSignatureData;
  autoDebit: AutoDebitData;
  mid: MIDData;
  
  // Final
  termsAccepted: boolean;
  declarationAccepted: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

// ============================================
// FORM STEP DEFINITION
// ============================================

export interface FormStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  isOptional: boolean;
  isComplete: boolean;
}

export const APPLICATION_STEPS: Omit<FormStep, 'isComplete'>[] = [
  { id: 'card-selection', stepNumber: 1, title: 'Card Selection', description: 'Choose your card type and limit', isOptional: false },
  { id: 'personal-info', stepNumber: 2, title: 'Personal Information', description: 'Your personal details', isOptional: false },
  { id: 'professional-info', stepNumber: 3, title: 'Professional Information', description: 'Your employment details', isOptional: false },
  { id: 'monthly-income', stepNumber: 4, title: 'Monthly Income', description: 'Income and salary details', isOptional: false },
  { id: 'bank-accounts', stepNumber: 5, title: 'Bank Accounts', description: 'Your existing bank accounts', isOptional: true },
  { id: 'credit-facilities', stepNumber: 6, title: 'Credit & Loans', description: 'Existing credit facilities', isOptional: true },
  { id: 'nominee', stepNumber: 7, title: 'MTB Protection Plan', description: 'Nominee details for MPP', isOptional: false },
  { id: 'supplementary', stepNumber: 8, title: 'Supplementary Card', description: 'Add-on card holder details', isOptional: true },
  { id: 'references', stepNumber: 9, title: 'References', description: 'Two mandatory references', isOptional: false },
  { id: 'documents', stepNumber: 10, title: 'Documents', description: 'Upload photos & signatures', isOptional: false },
  { id: 'auto-debit', stepNumber: 11, title: 'Auto Debit', description: 'Payment instruction', isOptional: false },
  { id: 'mid', stepNumber: 12, title: 'Declaration & Documents', description: 'MID declarations and checklist', isOptional: false },
];
