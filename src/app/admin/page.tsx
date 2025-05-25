"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";

interface FileItem {
  key: string;
  name: string;
  size: number;
  uploadedAt: number;
  customId: string | null;
  status: "Deletion Pending" | "Failed" | "Uploaded" | "Uploading";
  id: string;
}

export default function AdminPage() {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const itemsPerPage = 12;

  useEffect(() => {
    fetchFiles();
  }, [currentPage]);

  const fetchFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/files?page=${currentPage}&limit=${itemsPerPage}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch files");
      }

      if (!Array.isArray(data.files)) {
        throw new Error("Invalid response format");
      }

      console.log("Received files:", data.files);
      setFiles(data.files);
      setTotalPages(Math.ceil(data.total / itemsPerPage));
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Σφάλμα κατά τη φόρτωση των αρχείων");
      setFiles([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm("Είστε σίγουροι ότι θέλετε να διαγράψετε αυτό το αρχείο;")) {
      return;
    }

    try {
      const response = await fetch("/api/files", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ key }),
      });

      if (response.ok) {
        toast.success("Το αρχείο διαγράφηκε επιτυχώς");
        fetchFiles();
      } else {
        throw new Error("Failed to delete file");
      }
    } catch (error) {
      toast.error("Σφάλμα κατά τη διαγραφή του αρχείου");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("el-GR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getFileUrl = (file: FileItem) => {
    return `https://uploadthing.com/f/${file.key}`;
  };

  const isImageFile = (file: FileItem) => {
    return file.name.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) !== null;
  };

  const isVideoFile = (file: FileItem) => {
    return file.name.toLowerCase().match(/\.(mp4|webm|mov)$/) !== null;
  };

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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-serif text-rose-800 mb-8 text-center">Διαχείριση Αρχείων</h1>

        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {files.map((file, index) => (
                <div key={file.key || index} className="bg-white rounded-lg shadow-lg overflow-hidden">
                  <div className="aspect-square relative">
                    {isImageFile(file) ? (
                      <img
                        src={getFileUrl(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : isVideoFile(file) ? (
                      <video
                        src={getFileUrl(file)}
                        className="w-full h-full object-cover"
                        controls
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100">
                        <span className="text-gray-500">Unknown file type</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatFileSize(file.size)}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDate(file.uploadedAt)}
                    </p>
                    <button
                      onClick={() => handleDelete(file.key)}
                      className="mt-3 w-full bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                    >
                      Διαγραφή
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-8 flex justify-center gap-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-rose-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Προηγούμενο
              </button>
              <span className="px-4 py-2">
                Σελίδα {currentPage} από {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-rose-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Επόμενο
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
} 