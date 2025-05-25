import { NextResponse } from "next/server";
import { utapi } from "../../../lib/uploadthing";

interface FileData {
  key: string;
  name: string;
  size: number;
  uploadedAt: number;
  customId: string | null;
  status: "Deletion Pending" | "Failed" | "Uploaded" | "Uploading";
  id: string;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const offset = (page - 1) * limit;

    console.log("Fetching files from uploadthing v7...");
    // Get all files from uploadthing v7
    const response = await utapi.listFiles();
    // console.log("Raw uploadthing response:", response);
    
    const files = response.files;
    // console.log("Files data:", files);
    
    if (!Array.isArray(files)) {
      // console.log("Files is not an array:", files);
      return NextResponse.json({
        files: [],
        total: 0,
        page,
        limit,
      });
    }
    
    // Sort files by upload date (newest first)
    const sortedFiles = files.sort((a: FileData, b: FileData) => 
      b.uploadedAt - a.uploadedAt
    );
    // console.log("Sorted files:", sortedFiles);

    // Calculate pagination
    const total = sortedFiles.length;
    const paginatedFiles = sortedFiles.slice(offset, offset + limit);
    // console.log("Paginated files:", paginatedFiles);

    return NextResponse.json({
      files: paginatedFiles || [],
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    return NextResponse.json({
      files: [],
      total: 0,
      page: 1,
      limit: 12,
      error: "Failed to fetch files"
    }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { key } = await request.json();

    if (!key) {
      return NextResponse.json(
        { error: "File key is required" },
        { status: 400 }
      );
    }

    // Delete the file from uploadthing v7
    await utapi.deleteFiles([key]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
} 