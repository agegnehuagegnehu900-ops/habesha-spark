// Cloudinary unsigned upload helper
const CLOUD_NAME = "dljojsuqo";
const UPLOAD_PRESET = "agegnehu_videos";
const CLOUDINARY_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  resource_type: string;
  format: string;
  duration?: number;
  width?: number;
  height?: number;
  bytes: number;
}

const getCloudinaryErrorMessage = (status: number, responseText: string) => {
  let message = `Upload failed (${status})`;

  try {
    const parsed = JSON.parse(responseText);
    const cloudinaryMessage = parsed.error?.message;

    if (cloudinaryMessage === "Unknown API key ") {
      return "Cloudinary unsigned preset ወይም cloud name አልተጣጣመም";
    }

    if (cloudinaryMessage) {
      return cloudinaryMessage;
    }
  } catch {
    return message;
  }

  return message;
};

export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", CLOUDINARY_UPLOAD_URL);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Invalid response from Cloudinary"));
        }
        return;
      }

      reject(new Error(getCloudinaryErrorMessage(xhr.status, xhr.responseText)));
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

export function getVideoThumbnail(videoUrl: string): string {
  if (!videoUrl.includes("cloudinary.com")) return "";

  return videoUrl
    .replace("/upload/", "/upload/so_0,w_400,h_700,c_fill/")
    .replace(/\.(mp4|mov|webm|avi|mkv)$/i, ".jpg");
}
