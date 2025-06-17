document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("container");
  const signUpBtn = document.getElementById("signUp");
  const signInBtn = document.getElementById("signIn");

  if (signUpBtn && signInBtn && container) {
    signUpBtn.addEventListener("click", () => {
      container.classList.add("right-panel-active");
    });

    signInBtn.addEventListener("click", () => {
      container.classList.remove("right-panel-active");
    });
  }
});

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyANTX_hlswxnxUmQRz04bEWsk62IFpHeLo",
  authDomain: "to-dolist-1410.firebaseapp.com",
  databaseURL: "https://to-dolist-1410-default-rtdb.firebaseio.com",
  projectId: "to-dolist-1410",
  storageBucket: "to-dolist-1410.firebasestorage.app",
  messagingSenderId: "913318363010",
  appId: "1:913318363010:web:bc0e6ef4b3da3d4b3bd99b",
  measurementId: "G-1KEGYPKTR3",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
