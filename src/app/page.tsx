import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, Shield, BarChart3 } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-primary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-12">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Onboarding System</h1>
          </div>
          <nav className="space-x-4">
            <Link href="/login" className="text-white hover:text-primary-100">
              Login
            </Link>
          </nav>
        </header>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">Streamlined Client Onboarding</h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Simplify your client onboarding process with our comprehensive platform. From initial contact to compliance
            review, manage everything in one place.
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/onboarding/start">
              <Button size="lg" className="bg-white text-primary-600 hover:bg-primary-50">
                Start Onboarding
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg"
                variant="outline"
                className="bg-white text-primary-600 hover:bg-primary-50"
              >
                Admin Login
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Users className="w-8 h-8 text-white mb-2" />
              <CardTitle className="text-white">Client Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-primary-100">
                Manage client information and track onboarding progress
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <FileText className="w-8 h-8 text-white mb-2" />
              <CardTitle className="text-white">Document Upload</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-primary-100">
                Secure document upload with real-time status tracking
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <Shield className="w-8 h-8 text-white mb-2" />
              <CardTitle className="text-white">Compliance Review</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-primary-100">
                Comprehensive compliance and AML verification process
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <BarChart3 className="w-8 h-8 text-white mb-2" />
              <CardTitle className="text-white">Reporting</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-primary-100">
                Generate detailed onboarding reports and analytics
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Process Flow */}
        <div className="bg-white rounded-2xl p-8 mb-16">
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-800">Onboarding Process</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Initial Contact</h4>
              <p className="text-gray-600">Business department approves and creates onboarding account</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Form Completion</h4>
              <p className="text-gray-600">Client completes guided onboarding forms and uploads documents</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-success-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h4 className="text-xl font-semibold mb-2">Review & Approval</h4>
              <p className="text-gray-600">Compliance team reviews and approves for go-live</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
