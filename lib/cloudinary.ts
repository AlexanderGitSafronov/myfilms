import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageFromUrl(
  imageUrl: string,
  folder: string = "myfilms/posters"
): Promise<string | null> {
  try {
    const parsed = new URL(imageUrl);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return null;
    const result = await cloudinary.uploader.upload(imageUrl, {
      folder,
      transformation: [{ width: 500, crop: "limit" }, { quality: "auto" }],
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
}

export async function uploadImageFromBuffer(
  buffer: Buffer,
  folder: string = "myfilms/avatars"
): Promise<string | null> {
  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder, transformation: [{ width: 400, crop: "limit" }] }, (error, result) => {
          if (error) reject(error);
          else resolve(result as { secure_url: string });
        })
        .end(buffer);
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return null;
  }
}

export { cloudinary };
