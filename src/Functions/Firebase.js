// Import the functions you need from the SDKs you need
import firebase from "firebase/app";
import "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDlCktyJU_nwYj-6SDlguxSLRAk6weznEQ",
    authDomain: "beerja-84e5f.firebaseapp.com",
    projectId: "beerja-84e5f",
    storageBucket: "beerja-84e5f.appspot.com",
    messagingSenderId: "453501298891",
    appId: "1:453501298891:web:f31455addf2f4bb85d934e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const fs = firebase.firestore();

export default fs;