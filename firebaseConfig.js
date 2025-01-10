import { initializeApp } from 'firebase/app';
import { getFirestore } from "firebase/firestore";
import { API_KEY } from '@env';
import { AUTHDOMAIN } from '@env';
import { PROJECTID } from '@env';
import { STORAGEID } from '@env';
import { MESSAGINGSENDERID } from '@env';
import { APPID } from '@env';
const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTHDOMAIN,
  projectId: PROJECTID,
  storageBucket: STORAGEID,
  messagingSenderId: MESSAGINGSENDERID,
  appId: APPID,
};

// Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

export default app;
