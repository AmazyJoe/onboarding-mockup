"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { DocumentUpload } from "@/components/onboarding/document-upload"
import { DocumentStatus } from "@/components/onboarding/document-status"
import { ArrowLeft, CheckCircle, Upload, MessageSquare } from "lucide-react"
import Link from "next/link"

const requiredDocuments = [
  {
    id: "certificate_of_incorporation",
    name: "Certificate of Incorporation",
    description: "Official certificate of company incorporation",
    required: true,
  },
  {
    id: "tin_certificate",
    name: "TIN Certificate",
    description: "Tax identification number certificate",
    required: true,
  },
  {
    id: "memorandum_articles",
    name: "Memorandum & Articles of Association",
    description: "Company's memorandum and articles of association",
    required: true,
  },
  {
    id: "director_passports",
    name: "Director/UBO Passports",
    description: "Valid passports or IDs of all directors and UBOs",
    required: true,
  },
  {
    id: "operating_license",
    name: "Operating License",
    description: "Business operating license (if applicable)",
    required: false,
  },
  {
    id: "company_resolution",
    name: "Company Resolution Letter",
    description: "Board resolution authorizing the business relationship",
    required: true,
  },
]

export default function DocumentUploadPage() {
  const [documents, setDocuments] = useState<Record<string, any>>({})
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleDocumentUpload = (documentId: string, file: File, status = "pending") => {
    setDocuments((prev) => ({
      ...prev,
      [documentId]: {
        file,
        status,
        uploadedAt: new Date(),
        comments: [],
      },
    }))

    // Calculate progress
    const uploadedCount = Object.keys(documents).length + 1
    const requiredCount = requiredDocuments.filter((doc) => doc.required).length
    setUploadProgress((uploadedCount / requiredCount) * 100)
  }

  const getDocumentStatus = (docId: string) => {
    return documents[docId]?.status || "not_uploaded"
  }

  const allRequiredUploaded = requiredDocuments.filter((doc) => doc.required).every((doc) => documents[doc.id])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-primary text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center mb-4">
            <Link href="/onboarding/wizard">
              <Button variant="ghost" size="sm" className="text-white hover:bg-primary-600 mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Forms
              </Button>
            </Link>
            <h1 className="text-2xl font-bold">Document Upload</h1>
          </div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-primary-100">Upload Required Documents</span>
            <span className="text-primary-100">{Math.round(uploadProgress)}% Complete</span>
          </div>
          <Progress value={uploadProgress} className="h-2 bg-primary-600" />
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Upload className="w-6 h-6 mr-3 text-primary-500" />
                Required Documents
              </CardTitle>
              <CardDescription>
                Please upload all required documents. Accepted formats: PDF, DOC, DOCX, XLS, XLSX (Max 10MB each)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                {requiredDocuments.map((doc) => (
                  <div key={doc.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <h3 className="font-semibold">{doc.name}</h3>
                          {doc.required && (
                            <Badge variant="destructive" className="ml-2 text-xs">
                              Required
                            </Badge>
                          )}
                          <DocumentStatus status={getDocumentStatus(doc.id)} />
                        </div>
                        <p className="text-sm text-gray-600">{doc.description}</p>
                      </div>
                    </div>

                    <DocumentUpload
                      documentId={doc.id}
                      onUpload={(file) => handleDocumentUpload(doc.id, file)}
                      currentFile={documents[doc.id]?.file}
                      status={getDocumentStatus(doc.id)}
                    />

                    {documents[doc.id]?.comments?.length > 0 && (
                      <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                        <div className="flex items-center mb-2">
                          <MessageSquare className="w-4 h-4 text-yellow-600 mr-2" />
                          <span className="text-sm font-medium text-yellow-800">Compliance Comments</span>
                        </div>
                        {documents[doc.id].comments.map((comment: any, index: number) => (
                          <p key={index} className="text-sm text-yellow-700">
                            {comment.text}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Submit Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                {allRequiredUploaded ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center text-green-600">
                      <CheckCircle className="w-8 h-8 mr-2" />
                      <span className="text-lg font-semibold">All required documents uploaded!</span>
                    </div>
                    <p className="text-gray-600">
                      Your documents have been submitted for compliance review. You'll receive status updates via email.
                    </p>
                    <Button className="bg-gradient-primary hover:opacity-90" size="lg">
                      Submit for Review
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      Please upload all required documents to proceed with your onboarding.
                    </p>
                    <Button disabled variant="outline" size="lg">
                      Upload Required Documents First
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
