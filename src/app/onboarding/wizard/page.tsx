"use client"

import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ContactPersonForm } from "@/components/onboarding/contact-person-form"
import { CompanyDetailsForm } from "@/components/onboarding/company-details-form"
import { DirectorDetailsForm } from "@/components/onboarding/director-details-form"
import { AMLComplianceForm } from "@/components/onboarding/aml-compliance-form"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { apiClient } from "@/lib/api"
import type {
  ContactPersonData,
  CompanyDetailsData,
  DirectorDetailsData,
  AMLComplianceData,
  IndustryCategory,
  LegalEntityForm,
  AMLProgramType,
  State,
} from "@/lib/types"

const steps = [
  { id: 1, title: "Contact Person", component: ContactPersonForm },
  { id: 2, title: "Company Details", component: CompanyDetailsForm },
  { id: 3, title: "Director Details", component: DirectorDetailsForm },
  { id: 4, title: "AML & Compliance", component: AMLComplianceForm },
]

type StepData = ContactPersonData | CompanyDetailsData | DirectorDetailsData | AMLComplianceData

const STORAGE_KEYS = {
  CURRENT_STEP: "onboarding_current_step",
  FORM_DATA: "onboarding_form_data",
  ACCOUNT_DATA: "onboarding_account_data", // Store full account response
  COMPANY_ID: "onboarding_company_id",
  COMPLETED_STEPS: "onboarding_completed_steps",
}

export default function OnboardingWizardPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Record<number, StepData>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set())
  
  // Store account and company data from API responses
  const [accountData, setAccountData] = useState<any>(null)
  const [companyId, setCompanyId] = useState<string>("")

  // Reference data
  const [industryCategories, setIndustryCategories] = useState<IndustryCategory[]>([])
  const [legalEntityForms, setLegalEntityForms] = useState<LegalEntityForm[]>([])
  const [amlProgramTypes, setAMLProgramTypes] = useState<AMLProgramType[]>([])
  const [states, setStates] = useState<State[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState<string>("")

  const progress = (currentStep / steps.length) * 100

  
  const CurrentStepComponent = steps.find((step) => step.id === currentStep)?.component

  // Load persisted data on component mount
  useEffect(() => {
    const loadPersistedData = () => {
      try {
        // Load current step
        const savedStep = localStorage.getItem(STORAGE_KEYS.CURRENT_STEP)
        if (savedStep) {
          setCurrentStep(Number.parseInt(savedStep, 10))
        }

        // Load form data
        const savedFormData = localStorage.getItem(STORAGE_KEYS.FORM_DATA)
        if (savedFormData) {
          setFormData(JSON.parse(savedFormData))
        }

        // Load account data
        const savedAccountData = localStorage.getItem(STORAGE_KEYS.ACCOUNT_DATA)
        if (savedAccountData) {
          setAccountData(JSON.parse(savedAccountData))
        }

        const savedCompanyId = localStorage.getItem(STORAGE_KEYS.COMPANY_ID)
        if (savedCompanyId) {
          setCompanyId(savedCompanyId)
        }

        // Load completed steps
        const savedCompletedSteps = localStorage.getItem(STORAGE_KEYS.COMPLETED_STEPS)
        if (savedCompletedSteps) {
          setCompletedSteps(new Set(JSON.parse(savedCompletedSteps)))
        }
      } catch (error) {
        console.error("Error loading persisted data:", error)
      }
    }

    loadPersistedData()
  }, [])

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_STEP, currentStep.toString())
  }, [currentStep])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FORM_DATA, JSON.stringify(formData))
  }, [formData])

  useEffect(() => {
    if (accountData) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNT_DATA, JSON.stringify(accountData))
    }
  }, [accountData])

  useEffect(() => {
    if (companyId) {
      localStorage.setItem(STORAGE_KEYS.COMPANY_ID, companyId)
    }
  }, [companyId])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPLETED_STEPS, JSON.stringify(Array.from(completedSteps)))
  }, [completedSteps])

  // Fetch reference data on component mount
  useEffect(() => {
    const fetchReferenceData = async () => {
      try {
        console.log("Starting to fetch reference data...")
        setApiError("")

        // Fetch each endpoint individually to see which ones fail
        let industriesRes: IndustryCategory[] = []
        let legalFormsRes: LegalEntityForm[] = []
        let amlTypesRes: AMLProgramType[] = []
        let statesRes: State[] = []

        try {
          console.log("Fetching industry categories...")
          industriesRes = await apiClient.getIndustryCategories()
          console.log("Industry categories fetched:", industriesRes)
        } catch (error) {
          console.error("Failed to fetch industry categories:", error)
          setApiError((prev) => prev + "Industry Categories failed. ")
        }

        try {
          console.log("Fetching legal entity forms...")
          legalFormsRes = await apiClient.getLegalEntityForms()
          console.log("Legal entity forms fetched:", legalFormsRes)
        } catch (error) {
          console.error("Failed to fetch legal entity forms:", error)
          setApiError((prev) => prev + "Legal Entity Forms failed. ")
        }

        try {
          console.log("Fetching AML program types...")
          amlTypesRes = await apiClient.getAMLProgramTypes()
          console.log("AML program types fetched:", amlTypesRes)
        } catch (error) {
          console.error("Failed to fetch AML program types:", error)
          setApiError((prev) => prev + "AML Program Types failed. ")
        }

        try {
          console.log("Fetching states...")
          statesRes = await apiClient.getStates()
          console.log("States fetched:", statesRes)
        } catch (error) {
          console.error("Failed to fetch states:", error)
          setApiError((prev) => prev + "States failed. ")
        }

        // Set the data regardless of individual failures
        setIndustryCategories(Array.isArray(industriesRes) ? industriesRes : [])
        setLegalEntityForms(Array.isArray(legalFormsRes) ? legalFormsRes : [])
        setAMLProgramTypes(Array.isArray(amlTypesRes) ? amlTypesRes : [])
        setStates(Array.isArray(statesRes) ? statesRes : [])

        console.log("Final reference data state:", {
          industries: industriesRes.length,
          legalForms: legalFormsRes.length,
          amlTypes: amlTypesRes.length,
          states: statesRes.length,
        })
      } catch (error) {
        console.error("Failed to fetch reference data:", error)
        setApiError("Failed to connect to API. Please check if your Django server is running.")
        // Ensure all states are set to empty arrays on error
        setIndustryCategories([])
        setLegalEntityForms([])
        setAMLProgramTypes([])
        setStates([])
      } finally {
        setLoading(false)
      }
    }

    fetchReferenceData()
  }, [])

  const clearPersistedData = () => {
    Object.values(STORAGE_KEYS).forEach((key) => {
      localStorage.removeItem(key)
    })
  }

  // app/onboarding/page.tsx
const handleNext = async () => {
  if (currentStep < steps.length) {
    // If we're moving from step 1 (Contact Person), create account
    if (currentStep === 1 && !completedSteps.has(1)) {
      setIsSubmitting(true);
      try {
        const contactData = formData[1] as ContactPersonData;
        console.log("Creating account with data:", contactData);
        // Store the full account response
        const response = await apiClient.createAccount(contactData);
        console.log("Account created successfully:", response);
        // Store the full account response
        setAccountData(response);
        setCompletedSteps((prev) => new Set([...prev, 1]));
      } catch (error) {
        console.error("Failed to create account:", error);
        alert("Failed to create account. Please try again.");
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }
    // If we're moving from step 2 (Company Details), create company
    if (currentStep === 2 && !completedSteps.has(2)) {
      setIsSubmitting(true);
      try {
        if (!accountData) {
          throw new Error("Account data not found. Please complete step 1 first.");
        }
        // Map the company data to match your API format - using full_name instead of username
        const baseCompanyData = formData[2] as CompanyDetailsData;
        const contactPersonData = formData[1] as ContactPersonData;
        const companyData = {
          ...baseCompanyData,
          contact_person: contactPersonData.full_name, // Use full_name instead of username
          state: "PENDING", // Default state
        };
        console.log("Creating company with API format (using full_name):", companyData);
        console.log("Sending contact_person as:", contactPersonData.full_name);
        const response = await apiClient.createCompany(companyData);
        console.log("Company created successfully:", response);
        setCompanyId(response.id);
        setCompletedSteps((prev) => new Set([...prev, 2]));
      } catch (error) {
        console.error("Failed to create company:", error);
        alert(`Failed to create company: ${error instanceof Error ? error.message : "Unknown error"}`);
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }
    // If we're moving from step 3 (Director Details), create directors
    if (currentStep === 3 && !completedSteps.has(3)) {
      setIsSubmitting(true);
      try {
        const directorsData = formData[3] as DirectorDetailsData;
        for (const director of directorsData.directors) {
          const directorPayload = {
            ...director,
            company: companyId, // Ensure this matches the expected field name in your backend
            state: "PENDING",
          };
          console.log("Creating director with data:", directorPayload);
          const response = await apiClient.createDirector(directorPayload);
          console.log("Director created successfully:", response);
        }
        setCompletedSteps((prev) => new Set([...prev, 3]));
      } catch (error) {
        console.error("Failed to create directors:", error);
        alert("Failed to create directors. Please try again.");
        setIsSubmitting(false);
        return;
      }
      setIsSubmitting(false);
    }
    setCurrentStep(currentStep + 1);
  } else {
    // Final submission - create AML compliance
    setIsSubmitting(true);
    try {
      // Create AML compliance
      const amlData = {
        ...(formData[4] as AMLComplianceData),
        company_id: companyId,
        state: "PENDING",
      };
      await apiClient.createAMLCompliance(amlData);
      console.log("Onboarding completed successfully!");
      // Clear persisted data since onboarding is complete
      clearPersistedData();
      // Redirect to document upload
      window.location.href = "/onboarding/documents";
    } catch (error) {
      console.error("Final submission failed:", error);
      alert("Submission failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }
};

  

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFormChange = useCallback(
    (stepData: StepData) => {
      setFormData((prev) => ({ ...prev, [currentStep]: stepData }))
    },
    [currentStep],
  )

  const canSkipToStep = (stepId: number) => {
    // Can only skip to a step if all previous steps are completed
    for (let i = 1; i < stepId; i++) {
      if (!completedSteps.has(i)) {
        return false
      }
    }
    return true
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p>Loading reference data from Django API...</p>
          <p className="text-sm text-gray-600 mt-2">
            Fetching from: {process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* API Error Banner */}
      {apiError && (
        <div className="bg-red-50 border border-red-200 p-4">
          <div className="container mx-auto">
            <p className="text-red-800 text-sm">
              <strong>API Connection Issues:</strong> {apiError}
              Please ensure your Django server is running at{" "}
              {process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">Onboarding Wizard</h1>
          <div className="flex items-center justify-between mb-4">
            <span className="text-primary-100">
              Step {currentStep} of {steps.length}: {steps.find((s) => s.id === currentStep)?.title}
            </span>
            <span className="text-primary-100">{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2 bg-primary-600" />

          {/* Step indicators */}
          <div className="flex justify-center mt-4 space-x-4">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => canSkipToStep(step.id) && setCurrentStep(step.id)}
                disabled={!canSkipToStep(step.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  currentStep === step.id
                    ? "bg-white text-primary-600"
                    : completedSteps.has(step.id)
                      ? "bg-green-500 text-white"
                      : canSkipToStep(step.id)
                        ? "bg-primary-400 text-white hover:bg-primary-300"
                        : "bg-primary-600 text-primary-300 cursor-not-allowed"
                }`}
              >
                {completedSteps.has(step.id) ? "✓" : step.id}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center mr-3">
                  <span className="text-white font-bold">{completedSteps.has(currentStep) ? "✓" : currentStep}</span>
                </div>
                {steps.find((s) => s.id === currentStep)?.title}
                {completedSteps.has(currentStep) && <span className="ml-2 text-green-600 text-sm">(Completed)</span>}
              </CardTitle>
              <CardDescription>
                {completedSteps.has(currentStep)
                  ? "This step has been completed. You can review and modify the information if needed."
                  : "Please fill in all required information to continue."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {CurrentStepComponent && (
                <>
                  {currentStep === 1 && (
                    <ContactPersonForm
                      data={(formData[currentStep] as Partial<ContactPersonData>) || {}}
                      onChange={handleFormChange}
                    />
                  )}
                  {currentStep === 2 && (
                    <CompanyDetailsForm
                      data={(formData[currentStep] as Partial<CompanyDetailsData>) || {}}
                      onChange={handleFormChange}
                      industryCategories={industryCategories}
                      legalEntityForms={legalEntityForms}
                      contactPersonName={(formData[1] as ContactPersonData)?.full_name || ""}
                    />
                  )}
                  {currentStep === 3 && (
                    <DirectorDetailsForm
                      data={(formData[currentStep] as Partial<DirectorDetailsData>) || {}}
                      onChange={handleFormChange}
                      companyLegalName={(formData[2] as CompanyDetailsData)?.legal_name}
                    />
                  )}
                  {currentStep === 4 && (
                    <AMLComplianceForm
                      data={(formData[currentStep] as Partial<AMLComplianceData>) || {}}
                      onChange={handleFormChange}
                      amlProgramTypes={amlProgramTypes}
                    />
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Debug Information */}
          {accountData && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-sm">Debug Information</CardTitle>
              </CardHeader>
              <CardContent className="text-xs">
                <p>
                  <strong>Account Data:</strong> {JSON.stringify(accountData, null, 2)}
                </p>
                {companyId && (
                  <p>
                    <strong>Company ID:</strong> {companyId}
                  </p>
                )}
                <p>
                  <strong>Completed Steps:</strong> {Array.from(completedSteps).join(", ")}
                </p>
                <p>
                  <strong>Contact Person for Company:</strong> {(formData[1] as ContactPersonData)?.full_name || "Not set"}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1 || isSubmitting}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <div className="flex space-x-4">
              {currentStep < steps.length && (
                <Button
                  variant="outline"
                  onClick={clearPersistedData}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Start Over
                </Button>
              )}
              <Button onClick={handleNext} className="bg-gradient-primary hover:opacity-90" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    {currentStep === 1 && !completedSteps.has(1)
                      ? "Creating Account..."
                      : currentStep === 2 && !completedSteps.has(2)
                        ? "Creating Company..."
                        : currentStep === steps.length
                          ? "Finalizing..."
                          : "Processing..."}
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2"></div>
                  </>
                ) : currentStep === steps.length ? (
                  <>
                    Complete Onboarding
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    {completedSteps.has(currentStep) ? "Continue" : "Next"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}