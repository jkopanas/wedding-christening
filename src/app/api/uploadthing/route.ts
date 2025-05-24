import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/uploadthing.config";

// Log to verify token is available
console.log("UploadThing Token available:", !!process.env.UPLOADTHING_TOKEN);

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
