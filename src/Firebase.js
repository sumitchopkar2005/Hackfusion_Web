import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const apiKey = import.meta.env.VITE_HACKFUSION_APIKEY;
const authDomain = import.meta.env.VITE_HACKFUSION_AUTHDOMAIN;
const databaseURL = import.meta.env.VITE_HACKFUSION_DATABASEURL;
const projectId = import.meta.env.VITE_HACKFUSION_PROJECTID;
const storageBucket = import.meta.env.VITE_HACKFUSION_STORAGEBUCKET;
const messagingSenderId = import.meta.env.VITE_HACKFUSION_MESSAGINGSENDERID;
const appId = import.meta.env.VITE_HACKFUSION_APPID;

const firebaseConfig = {
  apiKey,
  authDomain,
  databaseURL,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const storage = getStorage(app);
