import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB-_5QQntA-fj2N-K8xlVTnevRn4vIM8T0",
  authDomain: "puneri-mallus-auth.firebaseapp.com",
  projectId: "puneri-mallus-auth",
  storageBucket: "puneri-mallus-auth.firebasestorage.app",
  messagingSenderId: "1032264176833",
  appId: "1:1032264176833:web:395e5d631da582b4c13040",
  measurementId: "G-TJKS65QDKQ"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const auth = getAuth(app);