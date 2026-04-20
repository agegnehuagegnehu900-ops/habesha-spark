import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { storage, db } from "./firebase";

export interface UploadVideoParams {
  file: File;
  userId: string;
  description?: string;
  onProgress?: (percent: number) => void;
}

export async function uploadVideoToFirebase({
  file,
  userId,
  description,
  onProgress,
}: UploadVideoParams): Promise<{ id: string; videoUrl: string }> {
  const path = `videos/${userId}/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, file, { contentType: file.type });

  return new Promise((resolve, reject) => {
    task.on(
      "state_changed",
      (snap) => {
        if (onProgress) {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        }
      },
      reject,
      async () => {
        try {
          const videoUrl = await getDownloadURL(task.snapshot.ref);
          const docRef = await addDoc(collection(db, "videos"), {
            user_id: userId,
            video_url: videoUrl,
            storage_path: path,
            description: description || null,
            views_count: 0,
            likes_count: 0,
            comments_count: 0,
            shares_count: 0,
            created_at: serverTimestamp(),
          });
          resolve({ id: docRef.id, videoUrl });
        } catch (e) {
          reject(e);
        }
      }
    );
  });
}
