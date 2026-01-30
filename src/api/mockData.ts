/**
 * MTB Credit Card Application - Mock Data Repository
 * 
 * Centralized mock data matching real API contracts exactly.
 * When switching to REAL mode, only configuration changes are needed.
 */

// ============================================
// CARD PRODUCTS
// ============================================

export const MOCK_CARD_PRODUCTS = [
  {
    card_id: 1,
    product_code: 'VISA_PLATINUM',
    product_name: 'MTB Visa Platinum Card',
    card_network: 'VISA',
    card_tier: 'PLATINUM',
    annual_fee: 3000,
    features: [
      'Airport Lounge Access',
      'Travel Insurance up to $50,000',
      '3% Cashback on all purchases',
      'Zero lost card liability',
      'Global acceptance at 50M+ merchants',
    ],
    requirements: {
      min_monthly_income: 50000,
      min_age: 21,
      max_age: 65,
      documents_required: ['NID', 'TIN', 'Bank Statement', 'Salary Certificate'],
    },
    image_url: '/cards/visa-platinum.png',
    is_active: true,
  },
  {
    card_id: 2,
    product_code: 'VISA_GOLD',
    product_name: 'MTB Visa Gold Card',
    card_network: 'VISA',
    card_tier: 'GOLD',
    annual_fee: 2000,
    features: [
      'Shopping discounts up to 20%',
      'Fuel surcharge waiver',
      'Add-on card facility',
      'Global acceptance',
      'EMI facility available',
    ],
    requirements: {
      min_monthly_income: 35000,
      min_age: 21,
      max_age: 65,
      documents_required: ['NID', 'Bank Statement', 'Salary Certificate'],
    },
    image_url: '/cards/visa-gold.png',
    is_active: true,
  },
  {
    card_id: 3,
    product_code: 'MASTERCARD_TITANIUM',
    product_name: 'MTB Mastercard Titanium',
    card_network: 'MASTERCARD',
    card_tier: 'TITANIUM',
    annual_fee: 1500,
    features: [
      'Contactless payments',
      'Mobile banking integration',
      'Low interest rate',
      'Wide merchant acceptance',
      'Reward points on spending',
    ],
    requirements: {
      min_monthly_income: 25000,
      min_age: 21,
      max_age: 65,
      documents_required: ['NID', 'Bank Statement'],
    },
    image_url: '/cards/mastercard-titanium.png',
    is_active: true,
  },
  {
    card_id: 4,
    product_code: 'VISA_CLASSIC',
    product_name: 'MTB Visa Classic Card',
    card_network: 'VISA',
    card_tier: 'CLASSIC',
    annual_fee: 1000,
    features: [
      'Easy approval process',
      'Basic cashback on purchases',
      'Wide acceptance',
      'Online shopping enabled',
      'SMS alerts',
    ],
    requirements: {
      min_monthly_income: 15000,
      min_age: 21,
      max_age: 65,
      documents_required: ['NID', 'Bank Statement'],
    },
    image_url: '/cards/visa-classic.png',
    is_active: true,
  },
];

// ============================================
// BANKS
// ============================================

export const MOCK_BANKS = [
  { code: 'MTB', name: 'Mutual Trust Bank', swift_code: 'MTBLBDDH' },
  { code: 'DBBL', name: 'Dutch-Bangla Bank', swift_code: 'DBBLBDDH' },
  { code: 'BRAC', name: 'BRAC Bank', swift_code: 'BRACBDDH' },
  { code: 'CITY', name: 'City Bank', swift_code: 'CITIBDDH' },
  { code: 'HSBC', name: 'HSBC Bangladesh', swift_code: 'HSBCBDDH' },
  { code: 'SCB', name: 'Standard Chartered Bank', swift_code: 'SCBLBDDH' },
  { code: 'EBL', name: 'Eastern Bank Limited', swift_code: 'EABORDDH' },
  { code: 'PRIME', name: 'Prime Bank', swift_code: 'PRBLBDDH' },
  { code: 'ONE', name: 'ONE Bank', swift_code: 'ONEBKDDH' },
  { code: 'UCB', name: 'United Commercial Bank', swift_code: 'UCBLBDDH' },
];

// ============================================
// APPLICATIONS (Mock Existing Applications)
// ============================================

export const MOCK_APPLICATIONS = [
  {
    application_id: 'APP_20260128_001',
    reference_number: 'MTBCC-20260128-001',
    status: 'UNDER_REVIEW',
    card_product_code: 'VISA_PLATINUM',
    card_product_name: 'MTB Visa Platinum Card',
    applicant_name: 'Ahmed Rahman',
    mobile_number: '01712345678',
    email: 'ahmed.rahman@email.com',
    created_at: '2026-01-28T10:30:00Z',
    submitted_at: '2026-01-28T11:45:00Z',
    last_updated_at: '2026-01-29T14:20:00Z',
    current_step: 12,
    total_steps: 12,
    is_submitted: true,
  },
  {
    application_id: 'APP_20260125_003',
    reference_number: 'MTBCC-20260125-003',
    status: 'DRAFT',
    card_product_code: 'VISA_GOLD',
    card_product_name: 'MTB Visa Gold Card',
    applicant_name: 'Ahmed Rahman',
    mobile_number: '01712345678',
    email: 'ahmed.rahman@email.com',
    created_at: '2026-01-25T15:00:00Z',
    submitted_at: null,
    last_updated_at: '2026-01-26T10:15:00Z',
    current_step: 5,
    total_steps: 12,
    is_submitted: false,
  },
  {
    application_id: 'APP_20260120_002',
    reference_number: 'MTBCC-20260120-002',
    status: 'APPROVED',
    card_product_code: 'MASTERCARD_TITANIUM',
    card_product_name: 'MTB Mastercard Titanium',
    applicant_name: 'Ahmed Rahman',
    mobile_number: '01712345678',
    email: 'ahmed.rahman@email.com',
    created_at: '2026-01-20T09:00:00Z',
    submitted_at: '2026-01-20T10:30:00Z',
    last_updated_at: '2026-01-22T16:45:00Z',
    current_step: 12,
    total_steps: 12,
    is_submitted: true,
  },
  {
    application_id: 'APP_20260115_004',
    reference_number: 'MTBCC-20260115-004',
    status: 'DOCUMENTS_REQUIRED',
    card_product_code: 'VISA_GOLD',
    card_product_name: 'MTB Visa Gold Card',
    applicant_name: 'Fatima Begum',
    mobile_number: '01812345678',
    email: 'fatima@email.com',
    created_at: '2026-01-15T11:00:00Z',
    submitted_at: '2026-01-15T12:00:00Z',
    last_updated_at: '2026-01-18T09:30:00Z',
    current_step: 12,
    total_steps: 12,
    is_submitted: true,
  },
];

// ============================================
// STATUS TIMELINE (for tracking)
// ============================================

export const MOCK_STATUS_TIMELINES: Record<string, Array<{
  timestamp: string;
  event: string;
  status: 'completed' | 'pending' | 'current' | 'error';
  description: string;
  actor?: string;
}>> = {
  'MTBCC-20260128-001': [
    { timestamp: '2026-01-28T10:30:00Z', event: 'Application Started', status: 'completed', description: 'Application form initiated' },
    { timestamp: '2026-01-28T11:45:00Z', event: 'Application Submitted', status: 'completed', description: 'All documents submitted successfully' },
    { timestamp: '2026-01-28T14:00:00Z', event: 'Document Verification', status: 'completed', description: 'Documents verified by verification team', actor: 'Verification Team' },
    { timestamp: '2026-01-29T10:00:00Z', event: 'Credit Assessment', status: 'current', description: 'Credit history and eligibility being reviewed', actor: 'Credit Team' },
    { timestamp: '', event: 'Final Approval', status: 'pending', description: 'Pending management approval' },
    { timestamp: '', event: 'Card Issuance', status: 'pending', description: 'Card will be issued after approval' },
  ],
  'MTBCC-20260120-002': [
    { timestamp: '2026-01-20T09:00:00Z', event: 'Application Started', status: 'completed', description: 'Application form initiated' },
    { timestamp: '2026-01-20T10:30:00Z', event: 'Application Submitted', status: 'completed', description: 'All documents submitted successfully' },
    { timestamp: '2026-01-20T14:30:00Z', event: 'Document Verification', status: 'completed', description: 'Documents verified successfully', actor: 'Verification Team' },
    { timestamp: '2026-01-21T10:00:00Z', event: 'Credit Assessment', status: 'completed', description: 'Credit assessment completed - Approved', actor: 'Credit Team' },
    { timestamp: '2026-01-22T11:00:00Z', event: 'Final Approval', status: 'completed', description: 'Application approved by management', actor: 'Branch Manager' },
    { timestamp: '2026-01-22T16:45:00Z', event: 'Card Issuance', status: 'completed', description: 'Card will be delivered in 7-10 working days' },
  ],
  'MTBCC-20260115-004': [
    { timestamp: '2026-01-15T11:00:00Z', event: 'Application Started', status: 'completed', description: 'Application form initiated' },
    { timestamp: '2026-01-15T12:00:00Z', event: 'Application Submitted', status: 'completed', description: 'Documents submitted' },
    { timestamp: '2026-01-16T10:00:00Z', event: 'Document Verification', status: 'error', description: 'Additional documents required - Please upload TIN certificate', actor: 'Verification Team' },
    { timestamp: '', event: 'Credit Assessment', status: 'pending', description: 'Pending document submission' },
    { timestamp: '', event: 'Final Approval', status: 'pending', description: 'Pending' },
    { timestamp: '', event: 'Card Issuance', status: 'pending', description: 'Pending' },
  ],
};

// ============================================
// RM CREDENTIALS (Mock Staff)
// ============================================

export const MOCK_RM_CREDENTIALS = [
  { staff_id: 'admin', password: 'admin123', name: 'System Administrator', role: 'ADMIN', branch_code: 'HQ', is_active: true },
  { staff_id: 'rm001', password: 'password', name: 'Karim Hossain', role: 'RM', branch_code: 'DHK001', is_active: true },
  { staff_id: 'rm002', password: 'password', name: 'Nasima Akter', role: 'RM', branch_code: 'DHK002', is_active: true },
  { staff_id: 'verifier', password: 'password', name: 'Verification Officer', role: 'VERIFIER', branch_code: 'HQ', is_active: true },
];

// ============================================
// SAMPLE DRAFT DATA (for resume feature)
// ============================================

export const MOCK_DRAFT_STEPS: Record<number, { step_name: string; data: Record<string, unknown>; is_complete: boolean; saved_at: string }> = {
  1: {
    step_name: 'card_selection',
    data: { card_id: 1, card_type: 'VISA_PLATINUM', card_product_name: 'MTB Visa Platinum Card' },
    is_complete: true,
    saved_at: '2026-01-30T10:00:00Z',
  },
  2: {
    step_name: 'personal_info',
    data: {
      nid_number: '1234567890123',
      full_name: 'Ahmed Rahman',
      name_on_card: 'AHMED RAHMAN',
      mobile_number: '01712345678',
      email: 'ahmed@example.com',
      date_of_birth: '1990-05-15',
      gender: 'MALE',
      marital_status: 'MARRIED',
      mother_name: 'Fatima Rahman',
      father_name: 'Mohammad Rahman',
      spouse_name: 'Ayesha Rahman',
    },
    is_complete: true,
    saved_at: '2026-01-30T10:05:00Z',
  },
  3: {
    step_name: 'professional_info',
    data: {
      employment_type: 'EMPLOYED',
      profession: 'PRIVATE_SECTOR',
      employer_name: 'ABC Corporation Ltd.',
      designation: 'Senior Manager',
      office_address: 'Gulshan-2, Dhaka',
      office_phone: '02-9876543',
      years_at_current_job: 5,
    },
    is_complete: true,
    saved_at: '2026-01-30T10:10:00Z',
  },
  4: {
    step_name: 'monthly_income',
    data: {
      monthly_income: 85000,
      other_income: 15000,
      income_source: 'SALARY',
      has_other_income: true,
      other_income_source: 'Freelance consulting',
    },
    is_complete: true,
    saved_at: '2026-01-30T10:15:00Z',
  },
  5: {
    step_name: 'bank_accounts',
    data: {
      has_mtb_account: true,
      bank_accounts: [
        { bank_code: 'MTB', account_number: '1234567890', account_type: 'SAVINGS', branch_name: 'Gulshan Branch' },
      ],
    },
    is_complete: true,
    saved_at: '2026-01-30T10:20:00Z',
  },
};

// ============================================
// PROFESSIONS & EMPLOYERS
// ============================================

export const MOCK_PROFESSIONS = [
  { code: 'PRIVATE_SECTOR', name: 'Private Sector Employee' },
  { code: 'GOVERNMENT', name: 'Government Employee' },
  { code: 'BUSINESS', name: 'Business Owner' },
  { code: 'SELF_EMPLOYED', name: 'Self Employed / Freelancer' },
  { code: 'PROFESSIONAL', name: 'Professional (Doctor/Lawyer/Engineer)' },
  { code: 'RETIRED', name: 'Retired' },
  { code: 'STUDENT', name: 'Student' },
  { code: 'HOMEMAKER', name: 'Homemaker' },
];

export const MOCK_INCOME_SOURCES = [
  { code: 'SALARY', name: 'Salary' },
  { code: 'BUSINESS', name: 'Business Income' },
  { code: 'RENTAL', name: 'Rental Income' },
  { code: 'INVESTMENT', name: 'Investment Income' },
  { code: 'PENSION', name: 'Pension' },
  { code: 'OTHER', name: 'Other' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getApplicationsByMobile(mobileNumber: string) {
  return MOCK_APPLICATIONS.filter(app => app.mobile_number === mobileNumber);
}

export function getApplicationByReference(referenceNumber: string) {
  return MOCK_APPLICATIONS.find(app => 
    app.reference_number.toUpperCase() === referenceNumber.toUpperCase()
  );
}

export function getStatusTimeline(referenceNumber: string) {
  return MOCK_STATUS_TIMELINES[referenceNumber] || [];
}

export function validateRMCredentials(staffId: string, password: string) {
  return MOCK_RM_CREDENTIALS.find(
    rm => rm.staff_id === staffId && rm.password === password && rm.is_active
  );
}

export function generateReferenceNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const seq = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `MTBCC-${dateStr}-${seq}`;
}

export function generateApplicationId(): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
  const seq = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `APP_${dateStr}_${seq}`;
}
