import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyB2oslRG68tBm1FNkYjL8jV2mTWCOOfA1U",
  authDomain: "saudia-jubba-house.firebaseapp.com",
  projectId: "saudia-jubba-house",
  storageBucket: "saudia-jubba-house.appspot.com",
  messagingSenderId: "406367978143",
  appId: "1:406367978143:web:40701a67d34d0dff8d18aa",
  measurementId: "G-995S4KLWBC",
  databaseURL: "https://saudia-jubba-house-default-rtdb.firebaseio.com",
};

const app = initializeApp(firebaseConfig);
export const firebaseDatabase = getFirestore(app);
export const firebaseDatabaseRealTime = getDatabase(app);
export const firebaseStorage = getStorage(app);
export const firebaseAuth = getAuth(app);
