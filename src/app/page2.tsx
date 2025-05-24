"use client";

import { CustomUploader } from "./CustomUploader";
import type { OurFileRouter } from "@/uploadthing.config";
import { Toaster, toast } from "react-hot-toast";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-100 via-blue-100 to-white p-8">
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
        <h1 className="text-4xl font-serif text-rose-800 mb-4">
          Share Your Memories 💒👶
        </h1>
        <p className="text-gray-600 mb-8">
          Celebrate with us by uploading your photos from the wedding and christening ceremony!
          Contribute to our shared family album with up to 10 images (max 4MB each).
        </p>

        <div className="flex justify-center gap-6 mb-4 text-rose-300">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v3m0 0l3 3m-3-3l-3 3m0 0v12m6-12v12m6 0H6" />
          </svg>
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 14v7m0 0a4 4 0 100-8 4 4 0 000 8zM8 6h8m0 0a4 4 0 01-8 0" />
          </svg>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-rose-100">
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-6">
              Drag and drop your photos here, or click to browse
            </p>
          </div>

          <CustomUploader
            endpoint="weddingPhotoUploader"
            onClientUploadComplete={(res: { url: string }[]) => {
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
            className="ut-button:bg-rose-500 ut-button:hover:bg-rose-600 ut-button:rounded-full ut-button:px-8 ut-button:py-3 ut-button:text-white ut-button:font-medium ut-button:transition-all ut-button:duration-200 ut-button:shadow-md ut-button:hover:shadow-lg ut-button:flex ut-button:items-center ut-button:justify-center ut-button:gap-2 ut-button:min-w-[200px] ut-button:mx-auto ut-button:disabled:opacity-70 ut-button:disabled:cursor-not-allowed"
            content={{
              button: "Upload Wedding & Christening Photos",
              allowedContent: "Images up to 4MB – max 10 files",
            }}
          />
        </div>

        {/* Optional: Add example image previews */}
        {/* <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
          <img src="/placeholders/wedding.jpg" className="rounded-lg shadow-sm" />
          <img src="/placeholders/christening.jpg" className="rounded-lg shadow-sm" />
        </div> */}

        <p className="mt-6 text-sm text-gray-500">
          Your photos will be added to our shared wedding & christening album. 
          Thank you for helping us preserve these precious moments! 💕
        </p>

        <p className="mt-8 text-sm text-rose-500 italic">
          With love,  
          <br />
          Maria, Giannis & Little Andreas 💕
        </p>
      </div>
    </main>
  );
}
