import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UTApi } from "uploadthing/server";

if (!process.env.UPLOADTHING_TOKEN) {
  throw new Error("Missing UPLOADTHING_TOKEN environment variable");
}

export const f = createUploadthing();

// Initialize UTApi with token
export const utapi = new UTApi({
  token: process.env.UPLOADTHING_TOKEN,
});

export const ourFileRouter = {
  weddingPhotoUploader: f({
    image: { maxFileSize: "32MB", maxFileCount: 10 },
    video: { maxFileSize: "32MB", maxFileCount: 10 },
  })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata);
      console.log("File URL:", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 