// src/app/onboarding/documents/page.tsx
"use client";

import { useState } from "react";
import { DocumentUpload } from "@/components/onboarding/document-upload";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function DocumentUploadPage() {
  const [files, setFiles] = useState<Record<string, File>>({});
  const router = useRouter();

  const handleUpload = (documentId: string) => (file: File) => {
    setFiles((prevFiles) => ({ ...prevFiles, [documentId]: file }));
  };

  const handleSubmit = () => {
    // Handle the final submission of all documents
    console.log("Submitting documents:", files);
    // Redirect to a confirmation page or dashboard
    router.push("/dashboard");
  };

  const documents = [
    { id: "certificate_of_incorporation", name: "Certificate of Incorporation" },
    { id: "memorandum_and_articles", name: "Memorandum and Articles of Association" },
    { id: "proof_of_address", name: "Proof of Registered Address" },
    { id: "director_id_proof", name: "Director's ID Proof" },
    { id: "ubo_declaration", name: "UBO Declaration" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Upload Required Documents</h1>
      <div className="space-y-6">
        {documents.map((doc) => (
          <div key={doc.id}>
            <h2 className="text-lg font-medium mb-2">{doc.name}</h2>
            <DocumentUpload
              documentId={doc.id}
              companyLegalName="Shofar Group Ltd" // Replace with dynamic value
              onUpload={handleUpload(doc.id)}
              currentFile={files[doc.id]}
            />
          </div>
        ))}
      </div>
      <div className="mt-8">
        <Button onClick={handleSubmit} className="bg-gradient-primary hover:opacity-90">
          Submit Documents
        </Button>
      </div>
    </div>
  );
}
