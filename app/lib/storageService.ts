import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage, isFirebaseConfigured } from "./firebase";

const MAX_IMAGE_MB = 10;
const MAX_ATTACHMENT_MB = 50;

function cleanFileName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");
}

/** Parse a Firebase Storage download URL back to an object path. */
export function getStoragePathFromUrl(fileUrlOrPath: string): string | null {
  if (!fileUrlOrPath) return null;
  if (!fileUrlOrPath.includes("firebasestorage.googleapis.com")) {
    return fileUrlOrPath.includes("/") ? fileUrlOrPath : null;
  }

  try {
    const match = fileUrlOrPath.match(/\/o\/([^?]+)/);
    if (!match?.[1]) return null;
    return decodeURIComponent(match[1]);
  } catch {
    return null;
  }
}

export function resourceAttachmentStoragePath(
  slug: string,
  fileName: string,
): string {
  return `resources/${slug}/attachments/${Date.now()}_${cleanFileName(fileName)}`;
}

export function resourceInlineStoragePath(
  slug: string,
  fileName: string,
): string {
  return `resources/${slug}/inline/${Date.now()}_${cleanFileName(fileName)}`;
}

async function uploadFileToPath(
  file: File,
  storagePath: string,
  onProgress?: (progressPercent: number) => void,
): Promise<{ url: string; storagePath: string }> {
  if (!isFirebaseConfigured() || !storage) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (onProgress) onProgress(100);
        resolve({
          url: reader.result as string,
          storagePath,
        });
      };
      reader.onerror = () => reject(new Error("Không thể đọc tệp."));
      reader.readAsDataURL(file);
    });
  }

  const storageRef = ref(storage, storagePath);
  const uploadTask = uploadBytesResumable(storageRef, file, {
    contentType: file.type || "application/octet-stream",
  });

  return new Promise((resolve, reject) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
        );
        if (onProgress) onProgress(percent);
      },
      (error) => {
        console.error("Firebase Storage upload error:", error);
        reject(
          new Error(
            "Lỗi khi tải file lên Storage: " + (error.message || "Vui lòng thử lại."),
          ),
        );
      },
      async () => {
        try {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          if (onProgress) onProgress(100);
          resolve({ url, storagePath });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Unknown error";
          reject(new Error("Lỗi khi lấy đường dẫn tải file: " + message));
        }
      },
    );
  });
}

/**
 * Uploads an image file to Firebase Storage.
 * In demo mode (when Firebase is not configured), it falls back to a base64 Data URL.
 */
export async function uploadMediaAsset(
  file: File,
  folder: string = "blog",
  onProgress?: (progressPercent: number) => void,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Chỉ hỗ trợ tải lên tệp hình ảnh (PNG, JPG, WEBP, GIF, v.v.).");
  }

  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    throw new Error(`Kích thước ảnh không được vượt quá ${MAX_IMAGE_MB}MB.`);
  }

  const storagePath = `${folder}/${Date.now()}_${cleanFileName(file.name)}`;
  const result = await uploadFileToPath(file, storagePath, onProgress);
  return result.url;
}

/** Upload a resource page attachment (PDF, Office, video, image, etc.). */
export async function uploadResourceAttachment(
  file: File,
  slug: string,
  onProgress?: (progressPercent: number) => void,
): Promise<{ url: string; storagePath: string }> {
  if (file.size > MAX_ATTACHMENT_MB * 1024 * 1024) {
    throw new Error(`Kích thước tệp không được vượt quá ${MAX_ATTACHMENT_MB}MB.`);
  }

  const storagePath = resourceAttachmentStoragePath(slug, file.name);
  return uploadFileToPath(file, storagePath, onProgress);
}

/** Upload an inline image for a resource page body (TipTap). */
export async function uploadResourceInlineImage(
  file: File,
  slug: string,
  onProgress?: (progressPercent: number) => void,
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Chỉ hỗ trợ tệp hình ảnh.");
  }

  if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
    throw new Error(`Kích thước ảnh không được vượt quá ${MAX_IMAGE_MB}MB.`);
  }

  const storagePath = resourceInlineStoragePath(slug, file.name);
  const result = await uploadFileToPath(file, storagePath, onProgress);
  return result.url;
}

/**
 * Safely deletes an asset from Firebase Storage given its public download URL or path.
 */
export async function deleteMediaAsset(
  fileUrlOrPath: string,
  storagePath?: string,
): Promise<void> {
  if (!isFirebaseConfigured() || !storage || !fileUrlOrPath) return;

  const resolvedPath =
    storagePath ?? getStoragePathFromUrl(fileUrlOrPath) ?? fileUrlOrPath;

  const allowedPrefixes = [
    "blog/",
    "milestones/",
    "uploads/",
    "documents/",
    "resources/",
  ];

  if (
    !fileUrlOrPath.includes("firebasestorage.googleapis.com") &&
    !allowedPrefixes.some((prefix) => resolvedPath.startsWith(prefix))
  ) {
    return;
  }

  try {
    await deleteObject(ref(storage, resolvedPath));
    console.info("Cleaned up storage asset:", resolvedPath);
  } catch (err) {
    console.warn("Storage deletion warning (file may already be deleted):", err);
  }
}
