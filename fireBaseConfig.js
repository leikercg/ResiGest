// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoJZ7xYVCg-tbZhO5BcDfHXSljXUhq6RM",
  authDomain: "preresigest.firebaseapp.com",
  projectId: "preresigest",
  storageBucket: "preresigest.firebasestorage.app",
  messagingSenderId: "811569449705",
  appId: "1:811569449705:web:449e30e7198c7053d37e78",
  measurementId: "G-HV21NDJL4K",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, app };
