// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_ENV_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_ENV_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_ENV_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_ENV_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_ENV_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_ENV_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider();
// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
