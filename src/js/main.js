import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";

document.addEventListener('DOMContentLoaded', () => {
  // Getting UI elements
  const msg = document.getElementById('message');
  const btn = document.getElementById('clickMe');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const signUpBtn = document.getElementById('signUp');
  const signInBtn = document.getElementById('signIn');
  const signOutBtn = document.getElementById('signOut');
  const googleSignInBtn = document.getElementById('googleSignIn'); // 👈 novo
  const authStatus = document.getElementById('authStatus');

  // Event Listeners
    btn.addEventListener('click', () => {
      msg.textContent = `Button clicked at ${new Date().toLocaleTimeString()}`;
    });
    signUpBtn?.addEventListener('click', signUp);
    signInBtn?.addEventListener('click', signIn);
    signOutBtn?.addEventListener('click', signOutUser);
    //googleSignInBtn?.addEventListener('click', signInWithGoogle); // 👈 novo
    googleSignInBtn?.addEventListener('click', () => {
      msg.textContent = `Botão google clicado`;
    });

  // Firebase Config (OK)
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

  // Provider do Google
  const googleProvider = new GoogleAuthProvider();

  // SIGN UP (email/senha)
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

  // SIGN IN (email/senha)
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

  // SIGN OUT
  async function signOutUser() {
    try {
      await signOut(auth);
      console.log('Signed out');
    } catch (err) {
      console.error('Sign out error', err);
    }
  }

  // GOOGLE SIGN-IN ✨✨✨
  async function signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log("Google login:", user);
      authStatus.textContent = `Signed in: ${user.displayName} (${user.email})`;
    } catch (err) {
      console.error("Google Sign-In Error:", err);
      alert(err.message || err);
    }
    }

  // Auth State Listener
  onAuthStateChanged(auth, (user) => {
    if (user) {
      authStatus.textContent = `Signed in: ${user.displayName || user.email}`;
    } else {
      authStatus.textContent = 'Signed out';
    }
  });
});
