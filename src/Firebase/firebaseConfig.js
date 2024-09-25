// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCOXa8W2SYzqmqYivkZ7S-TI-kaIQiX20o",
  authDomain: "findy-app-firebase-f8.firebaseapp.com",
  projectId: "findy-app-firebase-f8",
  storageBucket: "findy-app-firebase-f8.appspot.com",
  messagingSenderId: "558385920500",
  appId: "1:558385920500:web:e5e82bb66bdc7a6307e1a1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getFirestore(app)
