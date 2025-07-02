import type {
  ContactPersonData,
  CompanyDetailsData,
  Director,
  AMLComplianceData,
  ApiResponse,
  AccountResponse,
  CompanyResponse,
  IndustryCategory,
  LegalEntityForm,
  AMLProgramType,
  State,
  Account,
  Department,
  Role,
  Company,
} from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...options.headers,
      },
      mode: "cors",
      credentials: "include",
      ...options,
    }

    try {
      console.log(
        `API Request: ${options.method || "GET"} ${url}`,
        config.body ? JSON.parse(config.body as string) : null,
      )

      const response = await fetch(url, config)

      // Handle empty responses
      let data
      try {
        data = await response.json()
      } catch (e) {
        data = {}
      }

      if (!response.ok) {
        console.error(`API Error: ${response.status}`, data)
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`)
      }

      console.log(`API Response: ${url}`, data)

      // Handle Django API response format: { message, data, status }
      if (data && typeof data === "object" && "data" in data && data.status === "success") {
        return data.data as T
      }

      // Fallback to direct data if not in expected format
      return data
    } catch (error) {
      console.error("API request failed:", error)
      throw error
    }
  }

  // Step 1: Create Account
  async createAccount(data: ContactPersonData): Promise<AccountResponse> {
    return this.request<AccountResponse>("/base/accounts/create/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  // Step 2: Create Company
  async createCompany(data: CompanyDetailsData): Promise<CompanyResponse> {
    // Transform the data to match Django API expectations
    const payload = {
      contact_person: data.contact_person, // Use account username instead of account_id
      state: data.state,
      legal_name: data.legal_name,
      trading_name: data.trading_name,
      country_of_incorporation: data.country_of_incorporation,
      incorporation_registration_number: data.incorporation_registration_number,
      registered_address: data.registered_address,
      operating_address: data.operating_address,
      company_email: data.company_email,
      company_phone: data.company_phone,
      tax_certificate: data.tax_certificate,
      industry_category: data.industry_category,
      legal_entity_form: data.legal_entity_form,
      website_url: data.website_url,
      regulatory_license_info: data.regulatory_license_info,
    }

    return this.request<CompanyResponse>("/core/companies/create/", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  // Step 3: Create Director
  async createDirector(data: Director): Promise<ApiResponse> {
    // Transform the data to match Django API expectations
    const payload = {
      company: data.company, // Use company UUID
      state: data.state,
      full_name: data.full_name,
      valid_id_or_passport_number: data.valid_id_or_passport_number,
      is_ubo_shareholder: data.is_ubo_shareholder,
      ownership_percentage: data.ownership_percentage,
      has_other_directors: data.has_other_directors,
    }

    return this.request<ApiResponse>("/core/directors/create/", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  // Step 4: Create AML Compliance
  async createAMLCompliance(data: AMLComplianceData): Promise<ApiResponse> {
    // Transform the data to match Django API expectations
    const payload = {
      company: data.company_id, // Use company UUID
      state: data.state,
      is_regulated: data.is_regulated,
      has_aml_cft_program: data.has_aml_cft_program,
      has_shell_org_prevention: data.has_shell_org_prevention,
      has_transaction_screening: data.has_transaction_screening,
      aml_cft_program_type: data.aml_cft_program_type,
      tools_used: data.tools_used,
    }

    return this.request<ApiResponse>("/core/aml-compliance/create/", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  // Reference data fetching (GET endpoints)
  async getIndustryCategories(): Promise<IndustryCategory[]> {
    console.log("Fetching industry categories from:", `${this.baseURL}/base/industry-categories/`)
    return this.request<IndustryCategory[]>("/base/industry-categories/", {
      method: "GET",
    })
  }

  async getLegalEntityForms(): Promise<LegalEntityForm[]> {
    console.log("Fetching legal entity forms from:", `${this.baseURL}/base/legal-entity-forms/`)
    return this.request<LegalEntityForm[]>("/base/legal-entity-forms/", {
      method: "GET",
    })
  }

  async getAMLProgramTypes(): Promise<AMLProgramType[]> {
    console.log("Fetching AML program types from:", `${this.baseURL}/core/aml-program-types/`)
    return this.request<AMLProgramType[]>("/core/aml-program-types/", {
      method: "GET",
    })
  }

  async getStates(): Promise<State[]> {
    console.log("Fetching states from:", `${this.baseURL}/base/states/`)
    return this.request<State[]>("/base/states/", {
      method: "GET",
    })
  }

  // Admin endpoints - GET all data
  async getAccounts(): Promise<Account[]> {
    return this.request<Account[]>("/base/accounts/", {
      method: "GET",
    })
  }

  async getDepartments(): Promise<Department[]> {
    return this.request<Department[]>("/base/departments/", {
      method: "GET",
    })
  }

  async getRoles(): Promise<Role[]> {
    return this.request<Role[]>("/base/roles/", {
      method: "GET",
    })
  }

  async getCompanies(): Promise<Company[]> {
    return this.request<Company[]>("/core/companies/", {
      method: "GET",
    })
  }

  // Admin endpoints - CREATE
  async createIndustryCategory(data: { name: string; description: string }): Promise<ApiResponse> {
    return this.request<ApiResponse>("/base/industry-categories/create/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async createLegalEntityForm(data: { name: string; description: string }): Promise<ApiResponse> {
    return this.request<ApiResponse>("/base/legal-entity-forms/create/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async createAMLProgramType(data: { name: string; description: string }): Promise<ApiResponse> {
    return this.request<ApiResponse>("/core/aml-program-types/create/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async createRole(data: { role_name: string }): Promise<ApiResponse> {
    return this.request<ApiResponse>("/base/roles/create/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async createState(data: { name: string; description: string }): Promise<ApiResponse> {
    return this.request<ApiResponse>("/base/states/create/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async createDepartment(data: { name: string; description: string }): Promise<ApiResponse> {
    return this.request<ApiResponse>("/base/departments/create/", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async uploadDocument(formData: FormData): Promise<any> {
    const endpoint = "/core/documents/create/";
    const url = `${this.baseURL}${endpoint}`;

    const config: RequestInit = {
      method: "POST",
      body: formData,
      credentials: "include",
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const data = await response.json();
        console.error(`API Error: ${response.status}`, data);
        throw new Error(data.message || data.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`API Response: ${url}`, data);
      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  async getDocuments(): Promise<Document[]> {
    return this.request<Document[]>("/core/documents/", {
      method: "GET",
    });
  }

  async updateDocumentStatus(documentId: string, newStatus: string): Promise<any> {
    const endpoint = `/core/documents/${documentId}/update-status/`;
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify({ status: newStatus }),
    });
  }

  async addDocumentComment(documentId: string, comment: string): Promise<any> {
    const endpoint = "/core/document-comments/create/";
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify({ comment, document: documentId }),
    });
  }

}

export const apiClient = new ApiClient(API_BASE_URL)
