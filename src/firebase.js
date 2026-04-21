import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Konfigurasi Firebase SMK IT IQRO
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyCdInfws6kiyfWwzdXQfNAvZqVsHvkFlSk",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "smk-it-iqro.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "smk-it-iqro",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "smk-it-iqro.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "327114588479",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:327114588479:web:5c17371a756be89ee9138a",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-YDY5KMJVHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

export default app;
