import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
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
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
