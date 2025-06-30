"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import type { IndustryVerticalsData } from "@/lib/types"

interface IndustryVerticalsFormProps {
  data: Partial<IndustryVerticalsData>
  onChange: (data: IndustryVerticalsData) => void
}

const industryOptions = [
  "Financial Services",
  "Technology",
  "Healthcare",
  "Manufacturing",
  "Retail & E-commerce",
  "Agriculture",
  "Real Estate",
  "Transportation & Logistics",
  "Education",
  "Energy & Utilities",
  "Media & Entertainment",
  "Professional Services",
]

export function IndustryVerticalsForm({ data, onChange }: IndustryVerticalsFormProps) {
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>(data.selectedIndustries || [])
  const [otherIndustry, setOtherIndustry] = useState(data.otherIndustry || "")

  useEffect(() => {
    const hasChanged = JSON.stringify({ selectedIndustries, otherIndustry }) !== JSON.stringify(data)
    if (hasChanged) {
      onChange({ selectedIndustries, otherIndustry })
    }
  }, [selectedIndustries, otherIndustry])

  const handleIndustryChange = (industry: string, checked: boolean) => {
    if (checked) {
      setSelectedIndustries([...selectedIndustries, industry])
    } else {
      setSelectedIndustries(selectedIndustries.filter((i) => i !== industry))
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base font-semibold mb-4 block">
          Select your industry verticals (check all that apply) *
        </Label>
        <div className="grid md:grid-cols-2 gap-3">
          {industryOptions.map((industry) => (
            <div key={industry} className="flex items-center space-x-2">
              <Checkbox
                id={industry}
                checked={selectedIndustries.includes(industry)}
                onCheckedChange={(checked) => handleIndustryChange(industry, checked as boolean)}
              />
              <Label htmlFor={industry} className="text-sm font-normal">
                {industry}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otherIndustry">Other (please specify)</Label>
        <Input
          id="otherIndustry"
          value={otherIndustry}
          onChange={(e) => setOtherIndustry(e.target.value)}
          placeholder={"If your industry is not listed above, please specify"}
        />
      </div>

      {selectedIndustries.length === 0 && !otherIndustry && (
        <p className="text-sm text-red-600">
          Please select at least one industry vertical or specify in &quot;Other&quot;
        </p>
      )}
    </div>
  )
}
