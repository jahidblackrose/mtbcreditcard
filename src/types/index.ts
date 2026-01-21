/**
 * MTB Credit Card Application - Type Exports
 */

// API Types
export type {
  ApiResponse,
  ApiSuccessResponse,
  ApiErrorResponse,
  PaginationMeta,
  PaginatedResponse,
} from './api.types';

// Application Types - Legacy (to be deprecated)
export type {
  CardType,
  EmploymentType,
  DocumentType as LegacyDocumentType,
  CardProduct,
  ApplicantPersonalInfo,
  ApplicantAddress,
  ApplicantEmployment,
  UploadedDocument,
  CreditCardApplication,
  ApplicationSummary,
} from './application.types';

// Application Form Types - Comprehensive
export type {
  ApplicationMode,
  ApplicationStatus,
  CardNetwork,
  CardTier,
  CardCategory,
  Gender,
  MaritalStatus,
  Religion,
  EducationLevel,
  CustomerSegment,
  AccountType,
  FacilityType,
  DocumentType,
  NomineeRelationship,
  SupplementaryRelationship,
  RefereeRelationship,
  MailingAddressType,
  AutoDebitPreference,
  PreApplicationData,
  CardSelectionData,
  AddressData,
  PersonalInfoData,
  ProfessionalInfoData,
  SalariedIncomeData,
  BusinessIncomeData,
  AdditionalIncomeSource,
  MonthlyIncomeData,
  BankAccountData,
  CreditFacilityData,
  NomineeData,
  SupplementaryCardData,
  ReferenceData,
  ReferencesData,
  ImageSignatureData,
  AutoDebitData,
  DeclarationItem,
  DocumentChecklistItem,
  MIDData,
  FullApplicationData,
  FormStep,
} from './application-form.types';

export { APPLICATION_STEPS } from './application-form.types';

// User Types
export type {
  UserRole,
  User,
  StaffUser,
  UserSession,
  FullUserSession,
} from './user.types';
