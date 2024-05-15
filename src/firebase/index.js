import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCy9k_oqFdLH_vUNP8PI-vshGdkNvxaFQk",
  authDomain: "feedback-bsidb.firebaseapp.com",
  projectId: "feedback-bsidb",
  storageBucket: "feedback-bsidb.appspot.com",
  messagingSenderId: "291649792380",
  appId: "1:291649792380:web:72fcbbb3b2690473af1cf9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app);

export {
    db
}