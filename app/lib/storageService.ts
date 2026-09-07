import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage, isFirebaseConfigured } from "./firebase";

/**
 * Uploads an image file to Firebase Storage.
 * In demo mode (when Firebase is not configured), it falls back to a base64 Data URL.
 *
 * @param file The file to upload
 * @param folder Subfolder in storage bucket (default: "blog")
 * @param onProgress Callback receiving progress percentage (0 - 100)
 * @returns The public URL of the uploaded image
 */
export async function uploadMediaAsset(
  file: File,
  folder: string = "blog",
  onProgress?: (progressPercent: number) => void
): Promise<string> {
  // Validate file is an image
  if (!file.type.startsWith("image/")) {
    throw new Error("Chỉ hỗ trợ tải lên tệp hình ảnh (PNG, JPG, WEBP, GIF, v.v.).");
  }

  // Limit size to 10MB
  const MAX_SIZE_MB = 10;
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    throw new Error(`Kích thước ảnh không được vượt quá ${MAX_SIZE_MB}MB.`);
  }

  // Fallback to local Data URL in Demo mode
  if (!isFirebaseConfigured() || !storage) {
    console.info("Storage is not configured or in demo mode. Converting to Data URL fallback.");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (onProgress) onProgress(100);
        resolve(reader.result as string);
      };
      reader.onerror = () => reject(new Error("Không thể đọc tệp hình ảnh."));
      reader.readAsDataURL(file);
    });
  }

  // Real Firebase Storage upload
  const cleanFileName = file.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");
  const filePath = `${folder}/${Date.now()}_${cleanFileName}`;
  const storageRef = ref(storage, filePath);

  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type,
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        if (onProgress) onProgress(percent);
      },
      (error) => {
        console.error("Firebase Storage upload error:", error);
        reject(new Error("Lỗi khi tải ảnh lên Storage: " + (error.message || "Vui lòng thử lại.")));
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          if (onProgress) onProgress(100);
          resolve(downloadUrl);
        } catch (err: any) {
          reject(new Error("Lỗi khi lấy đường dẫn tải ảnh: " + err.message));
        }
      }
    );
  });
}

/**
 * Safely deletes an asset from Firebase Storage given its public download URL or path.
 * Silently catches errors if the file does not exist.
 */
export async function deleteMediaAsset(fileUrlOrPath: string): Promise<void> {
  if (!isFirebaseConfigured() || !storage || !fileUrlOrPath) return;

  // Only attempt deletion for Firebase Storage assets
  if (
    !fileUrlOrPath.includes("firebasestorage.googleapis.com") &&
    !fileUrlOrPath.startsWith("blog/") &&
    !fileUrlOrPath.startsWith("uploads/")
  ) {
    return;
  }

  try {
    const fileRef = ref(storage, fileUrlOrPath);
    await deleteObject(fileRef);
    console.info("Cleaned up storage asset:", fileUrlOrPath);
  } catch (err) {
    // If already deleted or not found, silently ignore
    console.warn("Storage deletion warning (file may already be deleted):", err);
  }
}

