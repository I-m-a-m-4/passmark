import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAqVEm25W-2xUOjKxh_ME2C2zDS33GxBKc",
  authDomain: "studio-3428128790-bb9f2.firebaseapp.com",
  projectId: "studio-3428128790-bb9f2",
  storageBucket: "studio-3428128790-bb9f2.firebasestorage.app",
  messagingSenderId: "294004599220",
  appId: "1:294004599220:web:fab10d73a9de73269a2ae1",
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
