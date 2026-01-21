/**
 * MTB Credit Card Application - Application DTOs
 * 
 * All money and amounts are treated as STRING for precision.
 */

/**
 * Application mode - Self service or Assisted by bank staff
 */
export type ApplicationMode = 'SELF' | 'ASSISTED';

/**
 * Application status throughout the journey
 */
export type ApplicationStatus = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'UNDER_REVIEW'
  | 'DOCUMENTS_REQUIRED'
  | 'APPROVED'
  | 'REJECTED'
  | 'CARD_ISSUED';

/**
 * Card types available for application
 */
export type CardType = 
  | 'VISA_CLASSIC'
  | 'VISA_GOLD'
  | 'VISA_PLATINUM'
  | 'MASTERCARD_STANDARD'
  | 'MASTERCARD_GOLD'
  | 'MASTERCARD_WORLD';

/**
 * Employment type for applicant
 */
export type EmploymentType = 
  | 'SALARIED'
  | 'SELF_EMPLOYED'
  | 'BUSINESS_OWNER'
  | 'RETIRED'
  | 'STUDENT';

/**
 * Document types for KYC
 */
export type DocumentType = 
  | 'NID'
  | 'PASSPORT'
  | 'DRIVING_LICENSE'
  | 'TIN_CERTIFICATE'
  | 'SALARY_SLIP'
  | 'BANK_STATEMENT'
  | 'UTILITY_BILL'
  | 'PHOTOGRAPH';

/**
 * Card product details
 */
export interface CardProduct {
  id: string;
  type: CardType;
  name: string;
  annualFee: string; // Amount as string
  interestRate: string; // Percentage as string
  creditLimitMin: string;
  creditLimitMax: string;
  benefits: string[];
  imageUrl?: string;
}

/**
 * Applicant personal information
 */
export interface ApplicantPersonalInfo {
  fullName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string; // ISO date string
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  nationality: string;
  nidNumber: string;
  mobileNumber: string;
  email: string;
}

/**
 * Applicant address information
 */
export interface ApplicantAddress {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  district: string;
  postalCode: string;
  country: string;
}

/**
 * Applicant employment information
 */
export interface ApplicantEmployment {
  employmentType: EmploymentType;
  employerName: string;
  designation: string;
  monthlyIncome: string; // Amount as string
  yearsOfExperience: number;
  officeAddress?: ApplicantAddress;
}

/**
 * Document upload record
 */
export interface UploadedDocument {
  id: string;
  type: DocumentType;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
  verificationStatus: 'PENDING' | 'VERIFIED' | 'REJECTED';
}

/**
 * Complete credit card application
 */
export interface CreditCardApplication {
  id: string;
  referenceNumber: string;
  mode: ApplicationMode;
  status: ApplicationStatus;
  selectedCard: CardProduct;
  personalInfo: ApplicantPersonalInfo;
  presentAddress: ApplicantAddress;
  permanentAddress: ApplicantAddress;
  employment: ApplicantEmployment;
  documents: UploadedDocument[];
  requestedCreditLimit: string;
  createdAt: string;
  updatedAt: string;
  submittedAt?: string;
}

/**
 * Application summary for list views
 */
export interface ApplicationSummary {
  id: string;
  referenceNumber: string;
  status: ApplicationStatus;
  cardType: CardType;
  applicantName: string;
  submittedAt?: string;
  lastUpdatedAt: string;
}
