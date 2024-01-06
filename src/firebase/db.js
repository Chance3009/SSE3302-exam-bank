import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAS2ftKtcirMipVPQ_RkcKTi16FJ26ZD40",
  authDomain: "exambank-a79d9.firebaseapp.com",
  projectId: "exambank-a79d9",
  storageBucket: "exambank-a79d9.appspot.com",
  messagingSenderId: "255397653173",
  appId: "1:255397653173:web:dd2dbe42ee5c2e1b3a2cfc",
  measurementId: "G-3ERWJVY05Q",
};

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

export const examsRef = collection(db, "examPapers");
export const coursesRef = collection(db, "courses");
