import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  // Simple interactive button behavior
  const msg = document.getElementById('message');
  const btn = document.getElementById('clickMe');
  if (msg && btn) {
    btn.addEventListener('click', () => {
      msg.textContent = `Button clicked at ${new Date().toLocaleTimeString()}`;
    });
  }

  // Auth UI elements
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const signUpBtn = document.getElementById('signUp');
  const signInBtn = document.getElementById('signIn');
  const signOutBtn = document.getElementById('signOut');
  const authStatus = document.getElementById('authStatus');

  // TODO: Replace with your Firebase project's config
  const firebaseConfig = {
  apiKey: "AIzaSyCpx6LjIAgSd6qguI_i-2PfrAbnd4MyXh8",
  authDomain: "oryzemfirebase.firebaseapp.com",
  projectId: "oryzemfirebase",
  storageBucket: "oryzemfirebase.firebasestorage.app",
  messagingSenderId: "892357545518",
  appId: "1:892357545518:web:95824e96df6800651759bf",
  measurementId: "G-8RP33FMB2F"
};

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  async function signUp() {
    const email = emailInput?.value || '';
    const password = passwordInput?.value || '';
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signed up:', userCredential.user);
    } catch (err) {
      console.error('Sign up error', err);
      alert(err.message || err);
    }
  }

  async function signIn() {
    const email = emailInput?.value || '';
    const password = passwordInput?.value || '';
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Signed in:', userCredential.user);
    } catch (err) {
      console.error('Sign in error', err);
      alert(err.message || err);
    }
  }

  async function signOutUser() {
    try {
      await signOut(auth);
      console.log('Signed out');
    } catch (err) {
      console.error('Sign out error', err);
    }
  }

  signUpBtn?.addEventListener('click', signUp);
  signInBtn?.addEventListener('click', signIn);
  signOutBtn?.addEventListener('click', signOutUser);

  onAuthStateChanged(auth, (user) => {
    if (user) {
      authStatus.textContent = `Signed in: ${user.email || user.uid}`;
    } else {
      authStatus.textContent = 'Signed out';
    }
  });
});
