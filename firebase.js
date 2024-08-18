// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB4QQ6WE6RxrrwKsAFHdSYge6jjFlW-jdY",
  authDomain: "flashcardsaas-e7a86.firebaseapp.com",
  projectId: "flashcardsaas-e7a86",
  storageBucket: "flashcardsaas-e7a86.appspot.com",
  messagingSenderId: "528204872540",
  appId: "1:528204872540:web:b2681444470d4b7c721f99",
  measurementId: "G-YP4XYPYEYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app)

export {db}