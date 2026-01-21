/**
 * MTB Credit Card Application - Form State Hook
 * 
 * Manages multi-step form state with save/resume capability.
 */

import { useState, useCallback, useEffect } from 'react';
import type {
  FullApplicationData,
  ApplicationMode,
  PreApplicationData,
  CardSelectionData,
  PersonalInfoData,
  ProfessionalInfoData,
  MonthlyIncomeData,
  BankAccountData,
  CreditFacilityData,
  NomineeData,
  SupplementaryCardData,
  ReferencesData,
  ImageSignatureData,
  AutoDebitData,
  MIDData,
} from '@/types/application-form.types';

const STORAGE_KEY = 'mtb_application_draft';

const getEmptyAddress = () => ({
  addressLine1: '',
  addressLine2: '',
  city: '',
  district: '',
  postalCode: '',
  country: 'Bangladesh',
});

const getInitialApplicationData = (mode: ApplicationMode): FullApplicationData => ({
  mode,
  status: 'DRAFT',
  currentStep: 0,
  preApplication: {
    fullName: '',
    nidNumber: '',
    dateOfBirth: '',
    mobileNumber: '',
    email: '',
  },
  otpVerified: mode === 'ASSISTED', // Assisted mode bypasses OTP
  cardSelection: {
    cardNetwork: 'VISA',
    cardTier: 'GOLD',
    cardCategory: 'REGULAR',
    expectedCreditLimit: '100000',
  },
  personalInfo: {
    nameOnCard: '',
    nationality: 'Bangladeshi',
    gender: 'MALE',
    dateOfBirth: '',
    religion: 'ISLAM',
    fatherName: '',
    motherName: '',
    maritalStatus: 'SINGLE',
    spouseName: '',
    spouseProfession: '',
    nidNumber: '',
    tin: '',
    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',
    permanentAddress: getEmptyAddress(),
    presentAddress: getEmptyAddress(),
    sameAsPermanent: false,
    mailingAddressType: 'PRESENT',
    mobileNumber: '',
    email: '',
    educationalQualification: 'GRADUATE',
  },
  professionalInfo: {
    customerSegment: 'SALARIED',
    organizationName: '',
    parentGroup: '',
    department: '',
    designation: '',
    officeAddress: getEmptyAddress(),
    lengthOfServiceYears: 0,
    lengthOfServiceMonths: 0,
    totalExperienceYears: 0,
    totalExperienceMonths: 0,
    previousEmployer: '',
    previousDesignation: '',
  },
  monthlyIncome: {
    isSalaried: true,
    salariedIncome: {
      grossSalary: '',
      totalDeduction: '',
      netSalary: '',
    },
    businessIncome: undefined,
    additionalIncomeSources: [],
  },
  bankAccounts: [],
  creditFacilities: [],
  nominee: {
    nomineeName: '',
    relationship: 'SPOUSE',
    dateOfBirth: '',
    contactAddress: '',
    mobileNumber: '',
    photoUrl: '',
    declarationAccepted: false,
  },
  supplementaryCard: undefined,
  hasSupplementaryCard: false,
  references: {
    reference1: {
      refereeName: '',
      relationship: 'COLLEAGUE',
      mobileNumber: '',
      workAddress: '',
      residenceAddress: '',
    },
    reference2: {
      refereeName: '',
      relationship: 'FRIEND',
      mobileNumber: '',
      workAddress: '',
      residenceAddress: '',
    },
  },
  imageSignature: {
    primaryApplicantPhoto: '',
    supplementaryApplicantPhoto: '',
    primaryApplicantSignature: '',
    supplementaryApplicantSignature: '',
  },
  autoDebit: {
    autoDebitPreference: 'MINIMUM_AMOUNT_DUE',
    accountName: '',
    mtbAccountNumber: '',
  },
  mid: {
    declarations: [
      { id: '1', question: 'Are you a politically exposed person (PEP)?', answer: null },
      { id: '2', question: 'Do you have any existing MTB credit card?', answer: null },
      { id: '3', question: 'Have you ever been declared bankrupt?', answer: null },
      { id: '4', question: 'Do you have any pending litigation?', answer: null },
    ],
    documentChecklist: [
      { id: 'nid', documentType: 'NID', label: 'National ID Card (Both Sides)', required: true, uploaded: false },
      { id: 'photo', documentType: 'PHOTOGRAPH', label: 'Passport Size Photograph', required: true, uploaded: false },
      { id: 'salary', documentType: 'SALARY_SLIP', label: 'Last 3 Months Salary Slip', required: false, uploaded: false },
      { id: 'bank_statement', documentType: 'BANK_STATEMENT', label: 'Last 6 Months Bank Statement', required: true, uploaded: false },
      { id: 'tin', documentType: 'TIN_CERTIFICATE', label: 'TIN Certificate (if available)', required: false, uploaded: false },
    ],
  },
  termsAccepted: false,
  declarationAccepted: false,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export function useApplicationForm(mode: ApplicationMode) {
  const [applicationData, setApplicationData] = useState<FullApplicationData>(() => {
    // Try to load saved draft
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Only use saved data if mode matches
        if (parsed.mode === mode) {
          return parsed;
        }
      } catch {
        // Invalid saved data, start fresh
      }
    }
    return getInitialApplicationData(mode);
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-save to localStorage on changes
  useEffect(() => {
    const dataToSave = {
      ...applicationData,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [applicationData]);

  // Update pre-application data
  const updatePreApplication = useCallback((data: Partial<PreApplicationData>) => {
    setApplicationData((prev) => ({
      ...prev,
      preApplication: { ...prev.preApplication, ...data },
      updatedAt: new Date().toISOString(),
    }));
  }, []);

  // Mark OTP as verified
  const setOtpVerified = useCallback((verified: boolean) => {
    setApplicationData((prev) => ({
      ...prev,
      otpVerified: verified,
      status: verified ? 'DRAFT' : 'PENDING_OTP',
    }));
  }, []);

  // Update card selection
  const updateCardSelection = useCallback((data: Partial<CardSelectionData>) => {
    setApplicationData((prev) => ({
      ...prev,
      cardSelection: { ...prev.cardSelection, ...data },
    }));
  }, []);

  // Update personal info
  const updatePersonalInfo = useCallback((data: Partial<PersonalInfoData>) => {
    setApplicationData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, ...data },
    }));
  }, []);

  // Update professional info
  const updateProfessionalInfo = useCallback((data: Partial<ProfessionalInfoData>) => {
    setApplicationData((prev) => ({
      ...prev,
      professionalInfo: { ...prev.professionalInfo, ...data },
    }));
  }, []);

  // Update monthly income
  const updateMonthlyIncome = useCallback((data: Partial<MonthlyIncomeData>) => {
    setApplicationData((prev) => ({
      ...prev,
      monthlyIncome: { ...prev.monthlyIncome, ...data },
    }));
  }, []);

  // Bank accounts CRUD
  const addBankAccount = useCallback((account: BankAccountData) => {
    setApplicationData((prev) => ({
      ...prev,
      bankAccounts: [...prev.bankAccounts, account],
    }));
  }, []);

  const updateBankAccount = useCallback((id: string, data: Partial<BankAccountData>) => {
    setApplicationData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.map((acc) =>
        acc.id === id ? { ...acc, ...data } : acc
      ),
    }));
  }, []);

  const removeBankAccount = useCallback((id: string) => {
    setApplicationData((prev) => ({
      ...prev,
      bankAccounts: prev.bankAccounts.filter((acc) => acc.id !== id),
    }));
  }, []);

  // Credit facilities CRUD
  const addCreditFacility = useCallback((facility: CreditFacilityData) => {
    setApplicationData((prev) => ({
      ...prev,
      creditFacilities: [...prev.creditFacilities, facility],
    }));
  }, []);

  const updateCreditFacility = useCallback((id: string, data: Partial<CreditFacilityData>) => {
    setApplicationData((prev) => ({
      ...prev,
      creditFacilities: prev.creditFacilities.map((fac) =>
        fac.id === id ? { ...fac, ...data } : fac
      ),
    }));
  }, []);

  const removeCreditFacility = useCallback((id: string) => {
    setApplicationData((prev) => ({
      ...prev,
      creditFacilities: prev.creditFacilities.filter((fac) => fac.id !== id),
    }));
  }, []);

  // Update nominee
  const updateNominee = useCallback((data: Partial<NomineeData>) => {
    setApplicationData((prev) => ({
      ...prev,
      nominee: { ...prev.nominee, ...data },
    }));
  }, []);

  // Update supplementary card
  const updateSupplementaryCard = useCallback((data: Partial<SupplementaryCardData> | undefined) => {
    setApplicationData((prev) => ({
      ...prev,
      supplementaryCard: data ? { ...(prev.supplementaryCard || {} as SupplementaryCardData), ...data } : undefined,
      hasSupplementaryCard: data !== undefined,
    }));
  }, []);

  // Update references
  const updateReferences = useCallback((data: Partial<ReferencesData>) => {
    setApplicationData((prev) => ({
      ...prev,
      references: { ...prev.references, ...data },
    }));
  }, []);

  // Update image/signature
  const updateImageSignature = useCallback((data: Partial<ImageSignatureData>) => {
    setApplicationData((prev) => ({
      ...prev,
      imageSignature: { ...prev.imageSignature, ...data },
    }));
  }, []);

  // Update auto debit
  const updateAutoDebit = useCallback((data: Partial<AutoDebitData>) => {
    setApplicationData((prev) => ({
      ...prev,
      autoDebit: { ...prev.autoDebit, ...data },
    }));
  }, []);

  // Update MID
  const updateMID = useCallback((data: Partial<MIDData>) => {
    setApplicationData((prev) => ({
      ...prev,
      mid: { ...prev.mid, ...data },
    }));
  }, []);

  // Navigation
  const goToStep = useCallback((step: number) => {
    setApplicationData((prev) => ({
      ...prev,
      currentStep: step,
    }));
  }, []);

  const nextStep = useCallback(() => {
    setApplicationData((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 12),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setApplicationData((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 0),
    }));
  }, []);

  // Accept terms
  const setTermsAccepted = useCallback((accepted: boolean) => {
    setApplicationData((prev) => ({
      ...prev,
      termsAccepted: accepted,
    }));
  }, []);

  const setDeclarationAccepted = useCallback((accepted: boolean) => {
    setApplicationData((prev) => ({
      ...prev,
      declarationAccepted: accepted,
    }));
  }, []);

  // Clear draft
  const clearDraft = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setApplicationData(getInitialApplicationData(mode));
  }, [mode]);

  // Check if there's a saved draft
  const hasSavedDraft = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.mode === mode && parsed.currentStep > 0;
      } catch {
        return false;
      }
    }
    return false;
  }, [mode]);

  return {
    applicationData,
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    
    // Pre-application
    updatePreApplication,
    setOtpVerified,
    
    // Step updates
    updateCardSelection,
    updatePersonalInfo,
    updateProfessionalInfo,
    updateMonthlyIncome,
    
    // Bank accounts
    addBankAccount,
    updateBankAccount,
    removeBankAccount,
    
    // Credit facilities
    addCreditFacility,
    updateCreditFacility,
    removeCreditFacility,
    
    // Other updates
    updateNominee,
    updateSupplementaryCard,
    updateReferences,
    updateImageSignature,
    updateAutoDebit,
    updateMID,
    
    // Navigation
    goToStep,
    nextStep,
    prevStep,
    
    // Terms
    setTermsAccepted,
    setDeclarationAccepted,
    
    // Draft management
    clearDraft,
    hasSavedDraft,
  };
}
