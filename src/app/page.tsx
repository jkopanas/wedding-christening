"use client";

import { CustomUploader } from "./CustomUploader"; 
import type { OurFileRouter } from "@/uploadthing.config";
import { Toaster, toast } from "react-hot-toast";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 to-white p-8">
      <Toaster 
        position="top-center"
        toastOptions={{
          style: {
            background: '#fff',
            color: '#4B5563',
            border: '1px solid #FBCFE8',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#EC4899',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-serif text-rose-800 mb-4">Share Your Wedding Memories 💍</h1>
        <p className="text-gray-600 mb-8">
          Help us capture the magic of this special day by sharing your photos.
          Upload up to 10 images (max 4MB each) to contribute to our wedding album.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-rose-100">
          <CustomUploader
            endpoint="weddingPhotoUploader"
            onClientUploadComplete={(res) => {
              toast.success("Thank you for sharing your memories! 💝", {
                duration: 4000,
              });
              console.log("Upload complete:", res);
            }}
            onUploadError={(error: Error) => {
              toast.error(`Upload failed: ${error.message}`, {
                duration: 4000,
              });
            }}
            className="ut-button:bg-rose-500 ut-button:hover:bg-rose-600 ut-button:rounded-full ut-button:px-8 ut-button:py-4 ut-button:text-white ut-button:font-semibold ut-button:text-lg ut-button:transition-all ut-button:duration-200 ut-button:shadow-lg ut-button:hover:shadow-xl ut-button:flex ut-button:items-center ut-button:justify-center ut-button:gap-2 ut-button:min-w-[250px] ut-button:mx-auto ut-button:disabled:opacity-70 ut-button:disabled:cursor-not-allowed ut-button:border-2 ut-button:border-rose-400 ut-button:hover:border-rose-500"
          />
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Your photos will be added to our shared wedding album. Thank you for helping us preserve these precious moments! 💕
        </p>
      </div>
    </main>
  );
}
