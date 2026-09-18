import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dm1gkway",
  api_key: process.env.CLOUDINARY_API_KEY || "494649576255156",
  api_secret: process.env.CLOUDINARY_API_SECRET || "86aeDgwOzTiWrS4BtNOY4qw8jfI",
  secure: true,
});

export interface CloudinaryUploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
}

/**
 * Upload a base64 string or file buffer to Cloudinary
 */
export async function uploadToCloudinary(
  fileBuffer: Buffer | string,
  folder = "caconnect_uploads",
  resourceType: "auto" | "image" | "raw" = "auto",
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    if (typeof fileBuffer === "string" && fileBuffer.startsWith("data:")) {
      cloudinary.uploader.upload(
        fileBuffer,
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary upload failed"));
          }
          resolve(result as CloudinaryUploadResult);
        },
      );
    } else {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error || !result) {
            return reject(error || new Error("Cloudinary upload failed"));
          }
          resolve(result as CloudinaryUploadResult);
        },
      );

      if (Buffer.isBuffer(fileBuffer)) {
        uploadStream.end(fileBuffer);
      } else {
        uploadStream.end(Buffer.from(fileBuffer));
      }
    }
  });
}

export default cloudinary;
