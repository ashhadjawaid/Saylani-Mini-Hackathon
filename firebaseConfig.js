import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import {
    getFirestore, collection, addDoc, setDoc, doc, query, where, orderBy, getDocs, getDoc, deleteDoc, updateDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage,ref, getDownloadURL, uploadBytesResumable } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyCuD9MsdiB6zGavP-emg1GBzjW3UDbF9vA",
    authDomain: "saylani-mini-hackathon-92111.firebaseapp.com",
    projectId: "saylani-mini-hackathon-92111",
    storageBucket: "saylani-mini-hackathon-92111.appspot.com",
    messagingSenderId: "688421362875",
    appId: "1:688421362875:web:5e1721192d1d487e531d9e",
    measurementId: "G-02DF92SW0B"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {
    auth,
    app,
    db,
    storage,
    getFirestore,
    collection,
    addDoc,
    setDoc,
    doc,
    getDoc,
    getAuth,
    createUserWithEmailAndPassword,
    query,
    where,
    getDocs,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut,
    ref,
    getDownloadURL,
    updateDoc,
    uploadBytesResumable,
    orderBy,
    deleteDoc,
    serverTimestamp,
    EmailAuthProvider,
    reauthenticateWithCredential,
    updatePassword
};