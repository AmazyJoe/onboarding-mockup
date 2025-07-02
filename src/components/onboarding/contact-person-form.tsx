"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ContactPersonData } from "@/lib/types";

// Define the props interface
interface ContactPersonFormProps {
  data: Partial<ContactPersonData>;
  onChange: (data: ContactPersonData) => void;
}

export function ContactPersonForm({ data, onChange }: ContactPersonFormProps) {
  // Initialize form data state - note we're using full_name instead of separate first/last
  const [formData, setFormData] = useState<ContactPersonData>({
    email: "",
    full_name: "", // Changed from first_name/last_name to full_name
    position: "",
    phone: "",
    ...data,
  });

  // Effect to handle changes in form data
  useEffect(() => {
    const hasChanged = JSON.stringify(formData) !== JSON.stringify(data);
    if (hasChanged) {
      console.log("Form data changed:", formData);
      onChange(formData);
    }
  }, [formData, data, onChange]);

  // Handle input changes
  const handleChange = (field: keyof ContactPersonData, value: string) => {
    console.log(`Field ${field} updated to ${value}`);
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name *</Label>
        <Input
          id="full_name"
          value={formData.full_name}
          onChange={(e) => handleChange("full_name", e.target.value)}
          placeholder="Enter your full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          placeholder="your.email@company.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="position">Position in Company *</Label>
        <Input
          id="position"
          value={formData.position}
          onChange={(e) => handleChange("position", e.target.value)}
          placeholder="e.g., CEO, Managing Director, etc."
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone Number (E.164 format) *</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          placeholder="+254712345678"
          pattern="^\+[1-9]\d{1,14}$"
          title="Please enter phone number in E.164 format (e.g., +254712345678)"
          required
        />
        <p className="text-sm text-gray-500">
          Format: +[country code][number] (e.g., +254712345678)
        </p>
      </div>

      {/* Debug info to show what will be sent to API */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
        <p className="font-semibold text-blue-800 mb-2">API Payload Preview:</p>
        <pre className="text-blue-700 text-xs">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  );
}