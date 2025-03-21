import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Votre configuration Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBWPz3Cw1WiLAIN7fTbtMVzlgQruOEl5EU",
    authDomain: "udrive-3a525.firebaseapp.com",
    projectId: "udrive-3a525",
    storageBucket: "udrive-3a525.firebasestorage.app",
    messagingSenderId: "938219997602",
    appId: "1:938219997602:web:6f068a65e302b3aa6c0afb",
    measurementId: "G-DMRS1Q9XXG"
  };

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };