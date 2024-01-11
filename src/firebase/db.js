import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "firebase/firestore";
import { firebaseConfig } from "./firebaseConfig";

const firebaseApp = initializeApp(firebaseConfig);
export const db = getFirestore(firebaseApp);

export const coursesRef = collection(db, "courses");
export const examsRef = collection(db, "examPapers");
export const quesRef = collection(db, "questions");
