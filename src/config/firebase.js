import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY || "AIzaSyAljNTuzfgwm7qK00LRlJAGtu1KHpu3MbQ",
  authDomain: "api-iara-7195a.firebaseapp.com",
  projectId: "api-iara-7195a",
  storageBucket: "api-iara-7195a.firebasestorage.app",
  messagingSenderId: "710625697637",
  appId: "1:710625697637:web:60c66c1a9a95dddf680b8c"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
