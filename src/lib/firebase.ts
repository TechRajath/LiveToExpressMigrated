import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOqcrb6JJchtPrnOTZMdF8o1ZMABSsaOs",
  authDomain: "livetoexpress-480fd.firebaseapp.com",
  projectId: "livetoexpress-480fd",
  storageBucket: "livetoexpress-480fd.firebasestorage.app",
  messagingSenderId: "1084319539717",
  appId: "1:1084319539717:web:bbfe26e052e5dd9b9d326c",
  measurementId: "G-TTY08DQZXS",
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
