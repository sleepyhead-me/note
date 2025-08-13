// js/firebase-init.js

// TODO: Replace the following with your app's Fsirebase project configuration
// This object is unique to your project and connects the website to your Firebase backend.
// Find it in your Firebase project settings under the "General" tab in the "Your apps" section.
const firebaseConfig = {
  apiKey: "AIzaSyBtCSFfTvu1peSJvU2mt2di29C4dlCRmLA",
  authDomain: "notebook-021.firebaseapp.com",
  projectId: "notebook-021",
  storageBucket: "notebook-021.firebasestorage.app",
  messagingSenderId: "698880291664",
  appId: "1:698880291664:web:2df8500cc801fb856c3255"
};

// --- DO NOT EDIT THE CODE BELOW THIS LINE ---

// Initialize Firebase services
const app = firebase.initializeApp(firebaseConfig);

// Make Firebase services available to all other scripts
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log("Firebase has been initialized successfully.");
