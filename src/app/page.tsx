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
        <p className="text-2xl font-serif text-rose-600 mb-6">
          1 Ιουνίου 2025
        </p>

        <h2 className="text-3xl font-serif text-rose-700 mb-4">
          Γεωργία & Στέλιος 💝
        </h2>

        <h2 className="text-3xl font-serif text-rose-700 mb-8">
          Δήμητρα 👶
        </h2>

        <p className="text-gray-600 mb-8">
          Βοηθήστε μας να καταγράψουμε τη μαγεία του γάμου της Γεωργίας & του Στέλιου και του βαπτίσματος της Δήμητρας μοιράζοντας τις φωτογραφίες και τα βίντεό σας.
          Μεταφορτώστε έως 10 αρχεία (μέγιστο 32MB το καθένα) για να συμβάλετε στο κοινό μας άλμπουμ.
        </p>

        <div className="bg-white rounded-lg shadow-lg p-8 border border-rose-100">
          <CustomUploader
            endpoint="weddingPhotoUploader"
            onClientUploadComplete={(res) => {
              toast.success("Ευχαριστούμε που μοιραστήκατε αυτές τις πολύτιμες στιγμές μαζί μας! 💝", {
                duration: 4000,
              });
              console.log("Upload complete:", res);
            }}
            onUploadError={(error: Error) => {
              toast.error(`Η μεταφόρτωση απέτυχε: ${error.message}`, {
                duration: 4000,
              });
            }}
            className="ut-button:bg-rose-500 ut-button:hover:bg-rose-600 ut-button:rounded-full ut-button:px-8 ut-button:py-4 ut-button:text-white ut-button:font-semibold ut-button:text-lg ut-button:transition-all ut-button:duration-200 ut-button:shadow-lg ut-button:hover:shadow-xl ut-button:flex ut-button:items-center ut-button:justify-center ut-button:gap-2 ut-button:min-w-[250px] ut-button:mx-auto ut-button:disabled:opacity-70 ut-button:disabled:cursor-not-allowed ut-button:border-2 ut-button:border-rose-400 ut-button:hover:border-rose-500"
          />
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Οι φωτογραφίες και τα βίντεό σας θα προστεθούν στο κοινό άλμπουμ του γάμου της Γεωργίας & του Στέλιου και του βαπτίσματος της Δήμητρας, διατηρώντας αυτές τις όμορφες αναμνήσεις. Ευχαριστούμε που μας βοηθάτε να καταγράψουμε αυτές τις στιγμές! 💕
        </p>
      </div>
    </main>
  );
}
