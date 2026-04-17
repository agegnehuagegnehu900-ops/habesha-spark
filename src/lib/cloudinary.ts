// Cloudinary unsigned upload helper
const CLOUD_NAME = "dljojsuqo";
const UPLOAD_PRESET = "agegnehu_videos"; // unsigned preset created in Cloudinary dashboard

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

export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResult> {
  const resourceType = file.type.startsWith("video/") ? "video" : "image";
  const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch (e) {
          reject(new Error("Invalid response from Cloudinary"));
        }
      } else {
        let msg = `Upload failed (${xhr.status})`;
        try {
          const err = JSON.parse(xhr.responseText);
          msg = err.error?.message || msg;
        } catch {}
        reject(new Error(msg));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.send(formData);
  });
}

// Generate optimized thumbnail URL from a Cloudinary video URL
export function getVideoThumbnail(videoUrl: string): string {
  if (!videoUrl.includes("cloudinary.com")) return "";
  return videoUrl.replace("/upload/", "/upload/so_0,w_400,h_700,c_fill/").replace(/\.(mp4|mov|webm|avi)$/i, ".jpg");
}
