"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function OnboardingStartPage() {
  const [credentials, setCredentials] = useState({
    username: "",
    tempPassword: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Redirect to onboarding wizard
    window.location.href = "/onboarding/wizard"
  }

  return (
    <div className="min-h-screen bg-gradient-primary flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to Onboarding</h1>
          <p className="text-xl text-primary-100">Let's get you started with your business registration</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Access Your Onboarding Portal</CardTitle>
            <CardDescription>
              Use the credentials provided by our Business Development team to begin your onboarding journey.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Enter your username"
                  value={credentials.username}
                  onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tempPassword">Temporary Password</Label>
                <Input
                  id="tempPassword"
                  type="password"
                  placeholder="Enter your temporary password"
                  value={credentials.tempPassword}
                  onChange={(e) => setCredentials({ ...credentials, tempPassword: e.target.value })}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90">
                Begin Onboarding
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            <div className="mt-6 p-4 bg-primary-50 rounded-lg">
              <h3 className="font-semibold text-primary-800 mb-2">What to expect:</h3>
              <ul className="text-sm text-primary-700 space-y-1">
                <li>• Complete your company and personal details</li>
                <li>• Upload required compliance documents</li>
                <li>• Real-time status updates throughout the process</li>
                <li>• Direct communication with our compliance team</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link href="/" className="text-primary-100 hover:text-white">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
