import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBEyAQKNRj9CQhbz0FhnSiMhO_7S_bCog0",
  authDomain: "contentorbit-3515d.firebaseapp.com",
  projectId: "contentorbit-3515d",
  storageBucket: "contentorbit-3515d.firebasestorage.app",
  messagingSenderId: "157003783288",
  appId: "1:157003783288:web:d57f0742e112b6d603218d",
  measurementId: "G-GRBX9NDBQ6"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export { signInWithPopup };