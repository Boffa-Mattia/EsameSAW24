// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { persistentLocalCache, persistentSingleTabManager, initializeFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTp3bDgbPBkmSM_2BM1afaGb51A3vkjAk",
  authDomain: "gameland-a3045.firebaseapp.com",
  projectId: "gameland-a3045",
  storageBucket: "gameland-a3045.appspot.com",
  messagingSenderId: "764052348131",
  appId: "1:764052348131:web:617abe711354a3136af9d6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentSingleTabManager()
  })
});

export { auth , db}