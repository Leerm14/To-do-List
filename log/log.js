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
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyANTX_hlswxnxUmQRz04bEWsk62IFpHeLo",
  authDomain: "to-dolist-1410.firebaseapp.com",
  databaseURL: "https://to-dolist-1410-default-rtdb.firebaseio.com",
  projectId: "to-dolist-1410",
  appId: "1:913318363010:web:bc0e6ef4b3da3d4b3bd99b",
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
    console.log("CreateACC Error:", err);
    if (err.code === "auth/email-already-in-use") {
      errorMessage.textContent = "Email đã được đăng ký";
    } else {
      errorMessage.textContent = "Đăng ký thất bại";
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
  signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.log("SignIn Error:", error);
      errorMessage.textContent = "Đăng nhập thất bại";
      errorMessage.style.display = "block";
    });
});
const googleLoginBtn = document.getElementById("google");
googleLoginBtn.addEventListener("click", () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.log("Google:", error);
      const errorMessage = document.getElementById("signin-password-error");
      if (errorMessage) {
        errorMessage.textContent = "Đăng nhập thất bại";
        errorMessage.style.display = "block";
      }
    });
});
const githubLoginBtn = document.getElementById("github");
githubLoginBtn.addEventListener("click", () => {
  const provider = new GithubAuthProvider();
  signInWithPopup(auth, provider)
    .then(() => {
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.log("github:", error);
      const errorMessage = document.getElementById("signin-password-error");
      if (errorMessage) {
        errorMessage.textContent = "Đăng nhập thất bại";
        errorMessage.style.display = "block";
      }
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
