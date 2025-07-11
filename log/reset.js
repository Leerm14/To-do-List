// reset.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getAuth,
  sendPasswordResetEmail,
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
const btn = document.getElementById("forgotPasswordBtn");
btn.addEventListener("click", () => {
  const email = document.getElementById("forgotEmail").value.trim();
  const msg = document.getElementById("forgotMessage");
  msg.style.display = "none";
  if (!email) {
    msg.textContent = "Vui lòng nhập email!";
    msg.style.color = "red";
    msg.style.display = "block";
    return;
  }
  sendPasswordResetEmail(auth, email)
    .then(() => {
      msg.textContent =
        "✅ Đã gửi liên kết đặt lại mật khẩu. Vui lòng kiểm tra hộp thư!";
      msg.style.color = "green";
      msg.style.display = "block";
    })
    .catch((error) => {
      console.error("Reset Error:", error);
      msg.style.color = "red";
      msg.textContent =
        error.code === "auth/user-not-found"
          ? "Email chưa được đăng ký!"
          : "Đã xảy ra lỗi. Vui lòng thử lại.";
      msg.style.display = "block";
    });
});
