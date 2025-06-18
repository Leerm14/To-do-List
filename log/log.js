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
const CreateACC = document.getElementById("CreateACC");
const SignIn = document.getElementById("SignIn");
const passwordInput = document.getElementById("PasswordCreate");
const confirmInput = document.getElementById("CheckPasswordCreate");
const confirmGroup = confirmInput.parentElement;
function validatePasswordMatch() {
  if (confirmInput.value && passwordInput.value === confirmInput.value) {
    confirmGroup.classList.add("correct");
  } else {
    confirmGroup.classList.remove("correct");
  }
}

passwordInput.addEventListener("input", validatePasswordMatch);
confirmInput.addEventListener("input", validatePasswordMatch);

CreateACC.addEventListener("click", () => {
  const email = document.getElementById("EmailCreate").value;
  const password = document.getElementById("PasswordCreate").value;
  const confirmPassword = document.getElementById("CheckPasswordCreate").value;
  const errorMessage = document.getElementById("Create-password-error");
  errorMessage.style.display = "none";
  if (password !== confirmPassword) {
    errorMessage.textContent = "Mật khẩu không khớp!";
    errorMessage.style.display = "block";
    return;
  }
  if (email === "" || password === "") {
    errorMessage.textContent = "Vui lòng điền đầy đủ thông tin!";
    errorMessage.style.display = "block";
    return;
  }
  createUserWithEmailAndPassword(auth, email, password).catch((err) => {
    let message = "";
    if (err.code === "auth/email-already-in-use") {
      errorMessage.textContent = "Email này đã được sử dụng!";
    } else if (err.code === "auth/invalid-email") {
      errorMessage.textContent = "Email không hợp lệ!";
    } else if (err.code === "auth/weak-password") {
      errorMessage.textContent = "Mật khẩu quá yếu. Hãy dùng ít nhất 6 ký tự!";
    } else {
      errorMessage.textContent = "Lỗi đăng ký: " + err.message;
    }
    errorMessage.style.display = "block";
  });
});
SignIn.addEventListener("click", () => {
  const email = document.getElementById("SignEmail").value;
  const password = document.getElementById("SignPass").value;
  const errorMessage = document.getElementById("signin-password-error");
  errorMessage.style.display = "none";

  if (email === "" || password === "") {
    errorMessage.textContent = "Vui lòng điền đầy đủ thông tin!";
    errorMessage.style.display = "block";
    return;
  }
  signInWithEmailAndPassword(auth, email, password).catch((error) => {
    if (error.code === "auth/user-not-found") {
      errorMessage.textContent = "Tài khoản chưa được đăng ký!";
    } else if (error.code === "auth/wrong-password") {
      errorMessage.textContent = "Mật khẩu không đúng!";
    } else if (error.code === "auth/invalid-email") {
      errorMessage.textContent = "Email không hợp lệ!";
    } else if (error.code === "auth/invalid-credential") {
      errorMessage.textContent = "Thông tin đăng nhập không hợp lệ.";
    } else {
      errorMessage.textContent = "Đăng nhập thất bại: " + error.message;
    }
    errorMessage.style.display = "block";
  });
});

onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  if (user) {
    if (path.endsWith("/log/log.html")) {
      window.location.href = "../index.html";
    }
  } else {
    if (!path.endsWith("/log/log.html")) {
      window.location.href = "log/log.html";
    }
  }
});
