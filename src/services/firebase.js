// src/services/firebase.js
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyCrnLFTZYwBff-wDHdp9EEJN9vWe549AbA",
    authDomain: "udg-mantenimiento-p8.firebaseapp.com",
    projectId: "udg-mantenimiento-p8",
    storageBucket: "udg-mantenimiento-p8.firebasestorage.app",
    messagingSenderId: "492699804822",
    appId: "1:492699804822:web:1bb344e93035974a79ceb7"
};

const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const storage = getStorage(app)