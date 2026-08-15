import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/** Uploads a file buffer to Cloudinary in the TeamUp folder, returns the secure URL. */
export function uploadToCloudinary(buffer: Buffer, filenameHint: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "TeamUp",
        public_id: filenameHint.replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9-_]/g, "-"),
        resource_type: "image",
        overwrite: false,
        unique_filename: true,
      },
      (error, result) => {
        if (error || !result) return reject(error || new Error("Cloudinary upload failed."));
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}
