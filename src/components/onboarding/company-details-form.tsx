"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { apiClient } from "@/lib/api"
import type { CompanyDetailsData, IndustryCategory, LegalEntityForm } from "@/lib/types"

interface CompanyDetailsFormProps {
  data: Partial<CompanyDetailsData>
  onChange: (data: CompanyDetailsData) => void
  industryCategories?: IndustryCategory[]
  legalEntityForms?: LegalEntityForm[]
  accountUsername: string // The username from the created account
  contactPersonName?: string // The full name from step 1
}

export function CompanyDetailsForm({
  data,
  onChange,
  industryCategories = [],
  legalEntityForms = [],
  accountUsername,
  contactPersonName = "",
}: CompanyDetailsFormProps) {
  const [formData, setFormData] = useState<CompanyDetailsData>({
    legal_name: "",
    trading_name: "",
    country_of_incorporation: "",
    incorporation_registration_number: "",
    registered_address: "",
    operating_address: "",
    company_email: "",
    company_phone: "",
    tax_certificate: "",
    industry_category: "",
    legal_entity_form: "",
    website_url: "",
    regulatory_license_info: "",
    contact_person: accountUsername, // This is the username that goes to the API
    account: contactPersonName, // This is the full name for display purposes
    ...data,
  })

  // Update contact_person and account fields whenever they change
  useEffect(() => {
    let hasChanged = false
    const updates: Partial<CompanyDetailsData> = {}
    
    if (accountUsername && formData.contact_person !== accountUsername) {
      updates.contact_person = accountUsername
      hasChanged = true
    }
    
    if (contactPersonName && formData.account !== contactPersonName) {
      updates.account = contactPersonName
      hasChanged = true
    }
    
    if (hasChanged) {
      setFormData(prev => ({ ...prev, ...updates }))
    }
  }, [accountUsername, contactPersonName, formData.contact_person, formData.account])

  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(data)
    if (hasChanged) {
      onChange(formData)
    }
  }, [formData, data, onChange])

  const handleChange = (field: keyof CompanyDetailsData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Show which account and contact person this company will be linked to */}
      {(accountUsername || contactPersonName) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 text-sm">
            <strong>Contact Person (Username):</strong> This company will be linked to username "{accountUsername}"
            {contactPersonName && (
              <>
                <br />
                <strong>Contact Person (Full Name):</strong> {contactPersonName}
              </>
            )}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="legal_name">Legal Name *</Label>
          <Input
            id="legal_name"
            value={formData.legal_name}
            onChange={(e) => handleChange("legal_name", e.target.value)}
            placeholder="Company legal name"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="trading_name">Trading Name *</Label>
          <Input
            id="trading_name"
            value={formData.trading_name}
            onChange={(e) => handleChange("trading_name", e.target.value)}
            placeholder="Trading/business name"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="country_of_incorporation">Country of Incorporation *</Label>
          <Select
            value={formData.country_of_incorporation}
            onValueChange={(value) => handleChange("country_of_incorporation", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kenya">Kenya</SelectItem>
              <SelectItem value="Uganda">Uganda</SelectItem>
              <SelectItem value="Tanzania">Tanzania</SelectItem>
              <SelectItem value="Rwanda">Rwanda</SelectItem>
              <SelectItem value="Ghana">Ghana</SelectItem>
              <SelectItem value="Zambia">Zambia</SelectItem>
              <SelectItem value="Cameroon">Cameroon</SelectItem>
              <SelectItem value="Cote d'Ivoire">Cote d&apos;Ivoire</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="legal_entity_form">Legal Entity Form *</Label>
          <Select
            value={formData.legal_entity_form}
            onValueChange={(value) => handleChange("legal_entity_form", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select entity type" />
            </SelectTrigger>
            <SelectContent>
              {Array.isArray(legalEntityForms) && legalEntityForms.length > 0 ? (
                legalEntityForms.map((form) => (
                  <SelectItem key={form.id} value={form.name}>
                    {form.name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem key="no-data" value="loading" disabled>
                  {legalEntityForms.length === 0 ? "Loading legal entity forms..." : "No forms available"}
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {Array.isArray(legalEntityForms) && legalEntityForms.length === 0 && (
            <p className="text-sm text-red-600">No legal entity forms available. Please check your database.</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry_category">Industry Category *</Label>
        <Select value={formData.industry_category} onValueChange={(value) => handleChange("industry_category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select industry category" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(industryCategories) && industryCategories.length > 0 ? (
              industryCategories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))
            ) : (
              <SelectItem key="no-data" value="loading" disabled>
                {industryCategories.length === 0 ? "Loading industry categories..." : "No categories available"}
              </SelectItem>
            )}
          </SelectContent>
        </Select>
        {Array.isArray(industryCategories) && industryCategories.length === 0 && (
          <p className="text-sm text-red-600">No industry categories available. Please check your database.</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="incorporation_registration_number">Company Registration Number *</Label>
        <Input
          id="incorporation_registration_number"
          value={formData.incorporation_registration_number}
          onChange={(e) => handleChange("incorporation_registration_number", e.target.value)}
          placeholder="Company incorporation/registration number"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="registered_address">Registered Address *</Label>
        <Textarea
          id="registered_address"
          value={formData.registered_address}
          onChange={(e) => handleChange("registered_address", e.target.value)}
          placeholder="Full registered address"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="operating_address">Operating Address *</Label>
        <Textarea
          id="operating_address"
          value={formData.operating_address}
          onChange={(e) => handleChange("operating_address", e.target.value)}
          placeholder="Full operating address"
          required
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company_email">Company Email *</Label>
          <Input
            id="company_email"
            type="email"
            value={formData.company_email}
            onChange={(e) => handleChange("company_email", e.target.value)}
            placeholder="info@company.com"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="company_phone">Company Phone *</Label>
          <Input
            id="company_phone"
            value={formData.company_phone}
            onChange={(e) => handleChange("company_phone", e.target.value)}
            placeholder="+254712345678"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tax_certificate">TIN Certificate Number *</Label>
          <Input
            id="tax_certificate"
            value={formData.tax_certificate}
            onChange={(e) => handleChange("tax_certificate", e.target.value)}
            placeholder="Tax identification number"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="website_url">Website URL</Label>
          <Input
            id="website_url"
            type="url"
            value={formData.website_url}
            onChange={(e) => handleChange("website_url", e.target.value)}
            placeholder="https://www.company.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="regulatory_license_info">Regulatory License Information</Label>
        <Textarea
          id="regulatory_license_info"
          value={formData.regulatory_license_info}
          onChange={(e) => handleChange("regulatory_license_info", e.target.value)}
          placeholder="Any regulatory licenses or certifications"
        />
      </div>

      {/* Debug information showing what will be sent to API */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-xs">
        <p><strong>API Payload Preview:</strong></p>
        <pre className="mt-2 text-gray-700">
          {JSON.stringify(
            {
              // Show the actual payload that will be sent to API (without account field)
              ...formData,
              account: undefined, // This won't be sent to API
            },
            null,
            2
          )}
        </pre>
        <div className="mt-2 pt-2 border-t border-gray-300">
          <p><strong>Field Mapping:</strong></p>
          <p>• contact_person (API): {formData.contact_person} (username)</p>
          <p>• account (display only): {formData.account} (full name)</p>
          <p><strong>Reference Data Status:</strong></p>
          <p>Industry Categories: {industryCategories.length} items</p>
          <p>Legal Entity Forms: {legalEntityForms.length} items</p>
          {industryCategories.length > 0 && <p>Sample Industry: {industryCategories[0]?.name}</p>}
          {legalEntityForms.length > 0 && <p>Sample Legal Form: {legalEntityForms[0]?.name}</p>}
        </div>
      </div>
    </div>
  )
}