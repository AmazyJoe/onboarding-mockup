"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { AMLComplianceData, AMLProgramType } from "@/lib/types"

interface AMLComplianceFormProps {
  data: Partial<AMLComplianceData>
  onChange: (data: AMLComplianceData) => void
  amlProgramTypes?: AMLProgramType[]
}

export function AMLComplianceForm({ data, onChange, amlProgramTypes = [] }: AMLComplianceFormProps) {
  const [formData, setFormData] = useState<AMLComplianceData>({
    is_regulated: false,
    has_aml_cft_program: false,
    has_shell_org_prevention: false,
    has_transaction_screening: false,
    aml_cft_program_type: "",
    tools_used: "",
    ...data,
  })

  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(data)
    if (hasChanged) {
      onChange(formData)
    }
  }, [formData])

  const handleBooleanChange = (field: keyof AMLComplianceData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value === "true" }))
  }

  const handleStringChange = (field: keyof AMLComplianceData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base font-semibold">Are you regulated? *</Label>
        <RadioGroup
          value={formData.is_regulated.toString()}
          onValueChange={(value) => handleBooleanChange("is_regulated", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="regulated-yes" />
            <Label htmlFor="regulated-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="regulated-no" />
            <Label htmlFor="regulated-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">Do you have a written AML/CFT compliance program? *</Label>
        <RadioGroup
          value={formData.has_aml_cft_program.toString()}
          onValueChange={(value) => handleBooleanChange("has_aml_cft_program", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="aml-yes" />
            <Label htmlFor="aml-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="aml-no" />
            <Label htmlFor="aml-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">
          Do you have procedures to prevent relationships with shell organizations? *
        </Label>
        <RadioGroup
          value={formData.has_shell_org_prevention.toString()}
          onValueChange={(value) => handleBooleanChange("has_shell_org_prevention", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="shell-yes" />
            <Label htmlFor="shell-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="shell-no" />
            <Label htmlFor="shell-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold">
          Do you have systems that screen transactions against sanctioned persons/entities/countries? *
        </Label>
        <RadioGroup
          value={formData.has_transaction_screening.toString()}
          onValueChange={(value) => handleBooleanChange("has_transaction_screening", value)}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="true" id="screening-yes" />
            <Label htmlFor="screening-yes">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="false" id="screening-no" />
            <Label htmlFor="screening-no">No</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-2">
        <Label htmlFor="aml_cft_program_type">AML/CFT Program Type *</Label>
        <Select
          value={formData.aml_cft_program_type}
          onValueChange={(value) => handleStringChange("aml_cft_program_type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select applicable AML/CFT program type" />
          </SelectTrigger>
          <SelectContent>
            {Array.isArray(amlProgramTypes) &&
              amlProgramTypes.map((type) => (
                <SelectItem key={type.id} value={type.name}>
                  {type.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tools_used">Tools used for compliance (or reason for none) *</Label>
        <Textarea
          id="tools_used"
          value={formData.tools_used}
          onChange={(e) => handleStringChange("tools_used", e.target.value)}
          placeholder="Describe the tools, software, or procedures you use for AML/CFT compliance, or explain why none are used"
          required
        />
      </div>
    </div>
  )
}
