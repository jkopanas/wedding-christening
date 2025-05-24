"use client";
import React, { useState } from "react";
import { UploadDropzone, generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "@/uploadthing.config";
import { toast } from "react-hot-toast";

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

interface CustomUploaderProps {
  endpoint: "weddingPhotoUploader";
  onClientUploadComplete: (res: { url: string }[]) => void;
  onUploadError: (error: Error) => void;
  className?: string;
  content?: {
    button: string;
    allowedContent: string;
  };
}

export function CustomUploader({
  endpoint,
  onClientUploadComplete,
  onUploadError,
  className,
  content
}: CustomUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const { startUpload, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      toast.dismiss();
      setSelectedFiles([]);
      setPreviewUrls([]);
      onClientUploadComplete(res as { url: string }[]);
      toast.success("Upload completed successfully!");
    },
    onUploadError: (error) => {
      toast.dismiss();
      onUploadError(error);
      toast.error("Upload failed. Please try again.");
    },
  });

  const handleFileSelect = (files: File[]) => {
    if (files.length > 10) {
      toast.error("You can only upload up to 10 photos");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 4 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Max size is 4MB`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      const urls = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
      toast.success(`Selected ${validFiles.length} photo(s)`);
    }
  };

  const triggerUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one photo");
      return;
    }

    startUpload(selectedFiles);
    toast.loading("Uploading your photos...");
  };

  return (
    <div className="rounded-lg border border-dashed border-rose-300 p-6 bg-white shadow-lg">
      <h2 className="text-xl font-semibold text-rose-700 mb-2">Upload Your Memories 📸</h2>

      {/* File Selection Area */}
      <div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            handleFileSelect(files);
          }}
          className="hidden"
          id="file-input"
        />
        <label
          htmlFor="file-input"
          className="block w-full p-4 text-center bg-rose-50 border-2 border-rose-300 border-dashed rounded-lg cursor-pointer hover:bg-rose-100 transition-colors"
        >
          <span className="text-rose-600 font-medium">Click to Select Photos</span>
          <p className="text-sm text-rose-500 mt-1">Select up to 10 photos (max 4MB each)</p>
        </label>
      </div>

      {/* Selected Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Selected Photos:</h3>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={triggerUpload}
              disabled={isUploading}
              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUploading ? "Uploading..." : `Upload ${selectedFiles.length} Photo${selectedFiles.length > 1 ? "s" : ""}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
