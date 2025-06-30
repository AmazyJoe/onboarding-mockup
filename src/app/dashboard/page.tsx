"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FileText, Shield, BarChart3, LogOut } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const handleLogout = () => {
    window.location.href = "/"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Onboarding Dashboard</h1>
                <p className="text-sm text-gray-600">Welcome to the admin dashboard!</p>
              </div>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Requires attention</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Ready for go-live</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">+5% from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>Latest onboarding submissions requiring review</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { company: "TechCorp Ltd", status: "pending", date: "2024-01-15" },
                { company: "Global Solutions Inc", status: "in_review", date: "2024-01-14" },
                { company: "StartupXYZ", status: "approved", date: "2024-01-13" },
                { company: "Enterprise Co", status: "action_required", date: "2024-01-12" },
              ].map((app, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-semibold">{app.company}</h4>
                    <p className="text-sm text-gray-600">Submitted on {app.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        app.status === "approved"
                          ? "default"
                          : app.status === "action_required"
                            ? "destructive"
                            : "secondary"
                      }
                    >
                      {app.status.replace("_", " ")}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Start New Onboarding</CardTitle>
              <CardDescription>Create a new onboarding session for a client</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/onboarding/start">
                <Button className="w-full bg-gradient-primary hover:opacity-90">Create New Session</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Django Admin</CardTitle>
              <CardDescription>Access Django admin panel to view submitted data</CardDescription>
            </CardHeader>
            <CardContent>
              <a href="http://127.0.0.1:8000/admin/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  Open Django Admin
                </Button>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Documentation</CardTitle>
              <CardDescription>View API endpoints and test functionality</CardDescription>
            </CardHeader>
            <CardContent>
              <a href="http://127.0.0.1:8000/api/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">
                  View API Docs
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
