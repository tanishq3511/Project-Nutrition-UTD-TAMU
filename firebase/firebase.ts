// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmhKtCH5SPH61TfoeOFWaJL4_OKM1D1eY",
  authDomain: "smartbite-2e190.firebaseapp.com",
  projectId: "smartbite-2e190",
  storageBucket: "smartbite-2e190.firebasestorage.app",
  messagingSenderId: "69948200501",
  appId: "1:69948200501:web:61ab5d44b7118231d6837c",
  measurementId: "G-69VTYMVFMS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);