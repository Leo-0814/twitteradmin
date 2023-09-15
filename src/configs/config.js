import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCnO0PXx7_YuSWUZC0SLeUcrY6pnvKnEg8",
  authDomain: "twitter-c19d8.firebaseapp.com",
  databaseURL: "https://twitter-c19d8-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "twitter-c19d8",
  storageBucket: "twitter-c19d8.appspot.com",
  messagingSenderId: "913536663921",
  appId: "1:913536663921:web:b0d8f8ed182f6262b3f6d0",
  measurementId: "G-737XH9TMW0"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = firebaseApp.database();

export default db;