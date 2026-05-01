// Firestore data access helpers for videos, likes, comments, follows
import {
  collection, doc, addDoc, deleteDoc, getDoc, getDocs, setDoc,
  query, where, orderBy, limit, startAfter, serverTimestamp,
  onSnapshot, increment, updateDoc, QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "./firebase";

export interface FSVideo {
  id: string;
  user_id: string;
  username?: string | null;
  video_url: string;
  thumbnail_url?: string | null;
  description?: string | null;
  song_name?: string | null;
  hashtags?: string[];
  views_count: number;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at?: any;
}

const PAGE = 5;

export async function fetchVideosPage(cursor: QueryDocumentSnapshot | null) {
  const base = collection(db, "videos");
  const q = cursor
    ? query(base, orderBy("created_at", "desc"), startAfter(cursor), limit(PAGE))
    : query(base, orderBy("created_at", "desc"), limit(PAGE));
  const snap = await getDocs(q);
  const videos: FSVideo[] = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
  const nextCursor = snap.docs.length === PAGE ? snap.docs[snap.docs.length - 1] : null;
  return { videos, nextCursor };
}

// LIKES: stored at videos/{vid}/likes/{uid}
export async function toggleLike(videoId: string, userId: string, currentlyLiked: boolean) {
  const likeRef = doc(db, "videos", videoId, "likes", userId);
  const videoRef = doc(db, "videos", videoId);
  if (currentlyLiked) {
    await deleteDoc(likeRef);
    await updateDoc(videoRef, { likes_count: increment(-1) }).catch(() => {});
  } else {
    await setDoc(likeRef, { user_id: userId, created_at: serverTimestamp() });
    await updateDoc(videoRef, { likes_count: increment(1) }).catch(() => {});
  }
}

export async function isLiked(videoId: string, userId: string) {
  const snap = await getDoc(doc(db, "videos", videoId, "likes", userId));
  return snap.exists();
}

// COMMENTS: videos/{vid}/comments
export interface FSComment {
  id: string;
  user_id: string;
  username: string;
  text: string;
  created_at?: any;
}

export function subscribeComments(videoId: string, cb: (list: FSComment[]) => void) {
  const q = query(collection(db, "videos", videoId, "comments"), orderBy("created_at", "desc"), limit(100));
  return onSnapshot(q, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) })));
  });
}

export async function addComment(videoId: string, userId: string, username: string, text: string) {
  await addDoc(collection(db, "videos", videoId, "comments"), {
    user_id: userId, username, text, created_at: serverTimestamp(),
  });
  await updateDoc(doc(db, "videos", videoId), { comments_count: increment(1) }).catch(() => {});
}

export async function incrementShares(videoId: string) {
  await updateDoc(doc(db, "videos", videoId), { shares_count: increment(1) }).catch(() => {});
}

// FOLLOWS: follows/{followerId}_{followingId}
export async function toggleFollow(followerId: string, followingId: string, currentlyFollowing: boolean) {
  const id = `${followerId}_${followingId}`;
  const ref = doc(db, "follows", id);
  if (currentlyFollowing) {
    await deleteDoc(ref);
  } else {
    await setDoc(ref, { follower_id: followerId, following_id: followingId, created_at: serverTimestamp() });
  }
}

export async function getFollowCounts(userId: string) {
  const followersSnap = await getDocs(query(collection(db, "follows"), where("following_id", "==", userId)));
  const followingSnap = await getDocs(query(collection(db, "follows"), where("follower_id", "==", userId)));
  return { followers: followersSnap.size, following: followingSnap.size };
}

export async function isFollowing(followerId: string, followingId: string) {
  const snap = await getDoc(doc(db, "follows", `${followerId}_${followingId}`));
  return snap.exists();
}

// SEARCH users and videos by hashtag/description prefix
export async function searchVideos(qstr: string) {
  const q = qstr.toLowerCase().trim();
  if (!q) return [];
  // simple client-side filter on recent videos (Firestore lacks LIKE)
  const snap = await getDocs(query(collection(db, "videos"), orderBy("created_at", "desc"), limit(100)));
  return snap.docs
    .map((d) => ({ id: d.id, ...(d.data() as any) } as FSVideo))
    .filter((v) =>
      (v.description || "").toLowerCase().includes(q) ||
      (v.username || "").toLowerCase().includes(q) ||
      (v.hashtags || []).some((h) => h.toLowerCase().includes(q))
    );
}
