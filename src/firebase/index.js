import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB6Ff0RLf3fsQLyJ8QvAisD01hzwSqNorQ",
  authDomain: "feedback-bsi.firebaseapp.com",
  projectId: "feedback-bsi",
  storageBucket: "feedback-bsi.appspot.com",
  messagingSenderId: "960766603060",
  appId: "1:960766603060:web:3039a53fb55e11be797f61"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app);

export {
    db
}