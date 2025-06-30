"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { AcknowledgmentData } from "@/lib/types"

interface AcknowledgmentFormProps {
  data: Partial<AcknowledgmentData>
  onChange: (data: AcknowledgmentData) => void
}

export function AcknowledgmentForm({ data, onChange }: AcknowledgmentFormProps) {
  const [formData, setFormData] = useState<AcknowledgmentData>({
    dataAccuracyConfirmed: false,
    digitalSignature: "",
    ...data,
  })

  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(data)
    if (hasChanged) {
      onChange(formData)
    }
  }, [formData])

  const handleChange = (field: keyof AcknowledgmentData, value: boolean | string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-8">
      <div className="bg-primary-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-primary-800 mb-4">Data Accuracy & Acknowledgment</h3>
        <p className="text-primary-700 mb-4">By proceeding, you acknowledge that:</p>
        <ul className="list-disc list-inside text-primary-700 space-y-2 mb-6">
          <li>All information provided is accurate and complete to the best of your knowledge</li>
          <li>You understand that false or misleading information may result in rejection of your application</li>
          <li>
            You consent to the collection and processing of your personal and business data for onboarding purposes
          </li>
          <li>You agree to provide additional documentation as requested by our compliance team</li>
          <li>You understand that this information will be used for regulatory compliance and risk assessment</li>
        </ul>
      </div>

      <div className="space-y-6">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="dataAccuracy"
            checked={formData.dataAccuracyConfirmed}
            onCheckedChange={(checked) => handleChange("dataAccuracyConfirmed", checked as boolean)}
            className="mt-1"
          />
          <Label htmlFor="dataAccuracy" className="text-sm leading-relaxed">
            I confirm that all the information provided in this onboarding form is accurate, complete, and true to the
            best of my knowledge. I understand that providing false or misleading information may result in the
            rejection of my application or termination of services. *
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="digitalSignature">Digital Signature *</Label>
          <Input
            id="digitalSignature"
            value={formData.digitalSignature}
            onChange={(e) => handleChange("digitalSignature", e.target.value)}
            placeholder="Type your full name as digital signature"
            required
          />
          <p className="text-sm text-gray-600">
            By typing your full name above, you are providing your digital signature and agreeing to the terms and
            conditions.
          </p>
        </div>
      </div>

      {(!formData.dataAccuracyConfirmed || !formData.digitalSignature) && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            Please confirm data accuracy and provide your digital signature to proceed.
          </p>
        </div>
      )}
    </div>
  )
}
