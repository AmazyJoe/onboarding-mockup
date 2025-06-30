// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

// Account creation (Step 1)
export interface ContactPersonData {
  username: string
  email: string
  full_name: string
  position: string
  phone: string
}

// Company creation (Step 2) - Updated to match new API format
export interface CompanyDetailsData {
  contact_person: string // This now stores the username from step 1
  state?: string
  legal_name: string
  trading_name: string
  country_of_incorporation: string
  incorporation_registration_number: string
  registered_address: string
  operating_address: string
  company_email: string
  company_phone: string
  tax_certificate: string
  industry_category: string
  legal_entity_form: string
  website_url: string
  regulatory_license_info: string
  account?: string // This will store the full_name from step 1 for display
}

// Director creation (Step 3)
export interface Director {
  id?: string
  company?: string
  state?: string
  full_name: string
  valid_id_or_passport_number: string
  is_ubo_shareholder: boolean
  ownership_percentage: number
  has_other_directors: boolean
}

export interface DirectorDetailsData {
  directors: Director[]
}

// Industry Verticals (for UI only - not sent to API)
export interface IndustryVerticalsData {
  selectedIndustries: string[]
  otherIndustry: string
}

// AML Compliance (Step 4)
export interface AMLComplianceData {
  company_id?: string
  state?: string
  is_regulated: boolean
  has_aml_cft_program: boolean
  has_shell_org_prevention: boolean
  has_transaction_screening: boolean
  aml_cft_program_type: string
  tools_used: string
}

// Acknowledgment (for UI only)
export interface AcknowledgmentData {
  dataAccuracyConfirmed: boolean
  digitalSignature: string
}

// Reference data types (fetched from backend)
export interface IndustryCategory {
  id: string
  name: string
  description: string
}

export interface LegalEntityForm {
  id: string
  name: string
  description: string
}

export interface AMLProgramType {
  id: string
  name: string
  description: string
}

export interface State {
  id: string
  name: string
  description: string
}

// Admin data types
export interface Account {
  id: string
  username: string
  email: string
  first_name?: string
  last_name?: string
  full_name?: string
  position: string
  phone: string
  created_at: string
}

export interface Department {
  id: string
  name: string
  description: string
}

export interface Role {
  id: string
  role_name: string
}

export interface Company {
  id: string
  contact_person: string // Updated to match new API format
  state: string
  legal_name: string
  trading_name: string
  country_of_incorporation: string
  incorporation_registration_number: string
  registered_address: string
  operating_address: string
  company_email: string
  company_phone: string
  tax_certificate: string
  industry_category: string
  legal_entity_form: string
  website_url: string
  regulatory_license_info: string
  account?: string // For backward compatibility / display purposes
  created_at: string
}

// Combined form data
export interface OnboardingFormData {
  contactPerson?: ContactPersonData
  companyDetails?: CompanyDetailsData
  directors?: DirectorDetailsData
  industryVerticals?: IndustryVerticalsData
  amlCompliance?: AMLComplianceData
  acknowledgment?: AcknowledgmentData
}

// API Response data
export interface AccountResponse {
  id: string
  username: string
  email: string
  full_name: string
  position: string
  phone: string
}

export interface CompanyResponse {
  id: string
  legal_name: string
  trading_name: string
  state: string
  contact_person: string // Updated to match new API format
  account?: string
}