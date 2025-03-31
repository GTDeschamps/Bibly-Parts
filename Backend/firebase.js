// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBs3XSVBIWD0XvEhjGNAyyXM00pvOVy4mA",
  authDomain: "bilby-parts.firebaseapp.com",
  projectId: "bilby-parts",
  storageBucket: "bilby-parts.firebasestorage.app",
  messagingSenderId: "628615739467",
  appId: "1:628615739467:web:fba763efe9f748fad875ce",
  measurementId: "G-YPKC9NLTKP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
