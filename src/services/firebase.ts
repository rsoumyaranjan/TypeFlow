import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDR7qjptrL9Y3UJTFvNxOM7y2CsNCJMEJM",
  authDomain: "typeflow-182cb.firebaseapp.com",
  projectId: "typeflow-182cb",
  storageBucket: "typeflow-182cb.firebasestorage.app",
  messagingSenderId: "204900888650",
  appId: "1:204900888650:web:c21839b4308fa173b076b3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const dbCloud = getFirestore(app);
export const auth = getAuth(app);
