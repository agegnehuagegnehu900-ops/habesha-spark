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
  appId: "1:179893918077:web:4132e1ad07c3288d4a5414",
  measurementId: "G-9BDYKV75ZF",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const firebaseAuth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
