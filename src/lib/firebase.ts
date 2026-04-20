// Firebase client — Auth, Firestore, Storage
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAMzcM24Qnls6Fw2lotxl4xgDBQvhNoXbg",
  authDomain: "habesha-tiktok-17314.firebaseapp.com",
  projectId: "habesha-tiktok-17314",
  storageBucket: "habesha-tiktok-17314.firebasestorage.app",
  messagingSenderId: "179893918077",
  appId: "1:179893918077:web:aed5bd4f0aaf01ae4a5414",
  measurementId: "G-2TSJN3RJHR",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
