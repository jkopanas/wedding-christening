import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  weddingPhotoUploader: f({
    image: { maxFileSize: "32MB", maxFileCount: 10 },
    video: { maxFileSize: "32MB", maxFileCount: 10 }
  })
    .onUploadComplete(({ file }) => {
      console.log("Upload complete:", file.url);
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
