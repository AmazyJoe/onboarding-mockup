"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import type { Director, DirectorDetailsData } from "@/lib/types"

interface DirectorDetailsFormProps {
  data: Partial<DirectorDetailsData>
  onChange: (data: DirectorDetailsData) => void;
  companyLegalName?:string;
}

export function DirectorDetailsForm({ data, onChange, companyLegalName }: DirectorDetailsFormProps) {
  const [directors, setDirectors] = useState<Director[]>(
    data.directors || [
      {
        id: "1",
        company:companyLegalName,
        full_name: "",
        valid_id_or_passport_number: "",
        is_ubo_shareholder: false,
        ownership_percentage: 0, // Changed to number
        has_other_directors: false,
      },
    ],
  )

  useEffect(() => {
    const hasChanged = JSON.stringify(directors) !== JSON.stringify(data.directors)
    if (hasChanged) {
      onChange({ directors })
    }
  }, [directors])

  const addDirector = () => {
    const newDirector: Director = {
      id: Date.now().toString(),
      full_name: "",
      valid_id_or_passport_number: "",
      is_ubo_shareholder: false,
      ownership_percentage: 0, // Changed to number
      has_other_directors: false,
    }
    setDirectors([...directors, newDirector])
  }

  const removeDirector = (id: string) => {
    if (directors.length > 1) {
      setDirectors(directors.filter((director) => director.id !== id))
    }
  }

  const updateDirector = (id: string, field: keyof Director, value: string | boolean | number) => {
    setDirectors(directors.map((director) => (director.id === id ? { ...director, [field]: value } : director)))
  }

  return (
    <div className="space-y-6">
      {directors.map((director, index) => (
        <Card key={director.id}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Director {index + 1}</CardTitle>
            {directors.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => removeDirector(director.id!)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`full_name-${director.id}`}>Full Name *</Label>
              <Input
                id={`full_name-${director.id}`}
                value={director.full_name}
                onChange={(e) => updateDirector(director.id!, "full_name", e.target.value)}
                placeholder="Director's full name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`valid_id_or_passport_number-${director.id}`}>Valid ID or Passport Number *</Label>
              <Input
                id={`valid_id_or_passport_number-${director.id}`}
                value={director.valid_id_or_passport_number}
                onChange={(e) => updateDirector(director.id!, "valid_id_or_passport_number", e.target.value)}
                placeholder="ID or passport number"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`is_ubo_shareholder-${director.id}`}
                checked={director.is_ubo_shareholder}
                onCheckedChange={(checked) => updateDirector(director.id!, "is_ubo_shareholder", checked as boolean)}
              />
              <Label htmlFor={`is_ubo_shareholder-${director.id}`}>Is this director a UBO/Shareholder?</Label>
            </div>

            {director.is_ubo_shareholder && (
              <div className="space-y-2">
                <Label htmlFor={`ownership_percentage-${director.id}`}>Ownership Percentage *</Label>
                <Input
                  id={`ownership_percentage-${director.id}`}
                  type="number"
                  min="0"
                  max="100"
                  step="0.01"
                  value={director.ownership_percentage}
                  onChange={(e) =>
                    updateDirector(director.id!, "ownership_percentage", Number.parseFloat(e.target.value) || 0)
                  }
                  placeholder="e.g., 25.50"
                  required
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <Checkbox
                id={`has_other_directors-${director.id}`}
                checked={director.has_other_directors}
                onCheckedChange={(checked) => updateDirector(director.id!, "has_other_directors", checked as boolean)}
              />
              <Label htmlFor={`has_other_directors-${director.id}`}>Does the company have other directors?</Label>
            </div>
          </CardContent>
        </Card>
      ))}

      <Button type="button" variant="outline" onClick={addDirector} className="w-full">
        <Plus className="w-4 h-4 mr-2" />
        Add Another Director
      </Button>
    </div>
  )
}
