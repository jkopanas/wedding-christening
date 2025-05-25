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
      toast.success("Η μεταφόρτωση ολοκληρώθηκε επιτυχώς!");
    },
    onUploadError: (error) => {
      toast.dismiss();
      onUploadError(error);
      toast.error("Η μεταφόρτωση απέτυχε. Παρακαλώ προσπαθήστε ξανά.");
    },
  });

  const handleFileSelect = (files: File[]) => {
    if (files.length > 10) {
      toast.error("Μπορείτε να μεταφορτώσετε έως 10 αρχεία");
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > 32 * 1024 * 1024) { // 32MB limit for videos
        toast.error(`${file.name} είναι πολύ μεγάλο. Το μέγιστο μέγεθος είναι 32MB`);
        return false;
      }
      if (!file.type.startsWith("image/") && !file.type.startsWith("video/")) {
        toast.error(`${file.name} δεν είναι αρχείο εικόνας ή βίντεο`);
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setSelectedFiles(validFiles);
      const urls = validFiles.map((file) => URL.createObjectURL(file));
      setPreviewUrls(urls);
      toast.success(`Επιλέχθηκαν ${validFiles.length} αρχείο(α)`);
    }
  };

  const triggerUpload = () => {
    if (selectedFiles.length === 0) {
      toast.error("Παρακαλώ επιλέξτε τουλάχιστον ένα αρχείο");
      return;
    }

    startUpload(selectedFiles);
    toast.loading("Μεταφόρτωση των αρχείων σας...");
  };

  return (
    <div className="rounded-lg border border-dashed border-rose-300 p-6 bg-white shadow-lg">
      <h2 className="text-xl font-semibold text-rose-700 mb-2">Μοιραστείτε τις Φωτογραφίες & τα Βίντεό σας από τον Γάμο & το Βάπτισμα 📸</h2>

      {/* File Selection Area */}
      <div>
        <input
          type="file"
          multiple
          accept="image/*,video/*"
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
          <span className="text-rose-600 font-medium">Κάντε κλικ για να Επιλέξετε Φωτογραφίες ή Βίντεο</span>
          <p className="text-sm text-rose-500 mt-1">Επιλέξτε έως 10 αρχεία (μέγιστο 32MB το καθένα)</p>
        </label>
      </div>

      {/* Selected Preview */}
      {selectedFiles.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Επιλεγμένα Αρχεία:</h3>
          <div className="grid grid-cols-4 gap-2 mb-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative aspect-square">
                {selectedFiles[index].type.startsWith("image/") ? (
                  <img
                    src={url}
                    alt={`Προεπισκόπηση ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <video
                    src={url}
                    className="w-full h-full object-cover rounded-lg"
                    controls
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center">
            <button
              onClick={triggerUpload}
              disabled={isUploading}
              className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-full shadow-lg transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUploading ? "Μεταφόρτωση..." : `Μεταφόρτωση ${selectedFiles.length} Αρχείο${selectedFiles.length > 1 ? "υ" : ""}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
