// src/components/onboarding/document-upload.tsx
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, File, X, Check } from "lucide-react";
import { apiClient } from "@/lib/api";

interface DocumentUploadProps {
  documentId: string;
  companyLegalName: string;
  onUpload: (file: File) => void;
  currentFile?: File;
  status?: string;
}

export function DocumentUpload({ documentId, companyLegalName, onUpload, currentFile, status }: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload only PDF, DOC, DOCX, XLS, or XLSX files");
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size must be less than 10MB");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("name", documentId);
      formData.append("company", companyLegalName);
      formData.append("file", file);

      const response = await apiClient.uploadDocument(formData);
      console.log("Upload successful:", response);
      onUpload(file);
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "pending":
        return "text-yellow-600";
      case "in_review":
        return "text-blue-600";
      case "complete":
        return "text-green-600";
      case "action_required":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "complete":
        return <Check className="w-4 h-4" />;
      case "pending":
        return <Upload className="w-4 h-4" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <Input
        ref={fileInputRef}
        type="file"
        onChange={handleChange}
        accept=".pdf,.doc,.docx,.xls,.xlsx"
        className="hidden"
      />

      {currentFile ? (
        <div className="flex items-center justify-between p-4 border border-green-200 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <div className={`${getStatusColor()}`}>{getStatusIcon()}</div>
            <div>
              <p className="font-medium text-green-800">{currentFile.name}</p>
              <p className="text-sm text-green-600">
                {(currentFile.size / 1024 / 1024).toFixed(2)} MB • Status: {status || "Uploaded"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={removeFile} className="text-red-600 hover:text-red-700">
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
            dragActive ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-primary-400"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700 mb-2">
            Drop your file here, or{" "}
            <button
              type="button"
              onClick={openFileDialog}
              className="text-primary-600 hover:text-primary-700 underline"
              disabled={uploading}
            >
              browse
            </button>
          </p>
          <p className="text-sm text-gray-500">Supports: PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</p>
          {uploading && (
            <div className="mt-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
              <p className="text-sm text-primary-600 mt-2">Uploading...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
