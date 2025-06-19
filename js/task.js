import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  get,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
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
const database = getDatabase(app);
const auth = getAuth(app);
window.onload = function () {
  const thu = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = new Date();
  const dayName = thu[day.getDay()];
  var buttonday = document.getElementsByClassName("day-button");
  let week = [];
  for (let i = 0; i < buttonday.length; i++) {
    if (
      buttonday[i].getElementsByClassName("day-label")[0].innerText == dayName
    ) {
      buttonday[i].getElementsByClassName("day-number")[0].innerText =
        day.getDate();
      buttonday[i].classList.add("clicked");
      var note = i;
      break;
    }
  }
  let count = 1;
  for (let i = note + 1; i < buttonday.length; i++) {
    buttonday[i].getElementsByClassName("day-number")[0].innerText =
      day.getDate() + count;
    count++;
  }
  for (let i = note - 1; i >= 0; i--) {
    buttonday[i].getElementsByClassName("day-number")[0].innerText =
      day.getDate() - (note - i);
  }
  let dayselect = document.querySelector(".day-button.clicked");
  if (dayselect) {
    let selectedDay =
      dayselect.getElementsByClassName("day-number")[0].innerText;
    renderTasksForDay(selectedDay);
  }
  for (let i = 0; i < buttonday.length; i++) {
    let dayNum = parseInt(
      buttonday[i].getElementsByClassName("day-number")[0].innerText,
      10
    );
    week.push([dayNum, i]);
  }
  return week;
};

function add() {
  const day = document.getElementById("date").value;
  const title = document.getElementById("title").value;
  const from = document.getElementById("from").value;
  const to = document.getElementById("to").value;
  const warning = document.getElementById("task-warning");
  warning.style.display = "none";
  if (!day || !title || !from || !to) {
    if (warning) warning.textContent = "Vui lòng điền đầy đủ thông tin!";
    warning.style.display = "block";
    return;
  }
  if (from >= to) {
    warning.textContent = "Thời gian bắt đầu phải trước thời gian kết thúc!";
    warning.style.display = "block";
    return;
  }
  let id = parseInt(day.split("-")[2], 10);
  resetform();
  addtask(id, title, from, to);
  let selectedDayButton = document.querySelector(".day-button.clicked");
  let selectedDay = day;
  if (selectedDayButton) {
    let dayNum =
      selectedDayButton.getElementsByClassName("day-number")[0].innerText;
    selectedDay = dayNum;
  }
  renderTasksForDay(selectedDay);
}
function addtask(day, title, from, to) {
  const user = auth.currentUser;
  push(ref(database, `users/${user.uid}/tasks/${day}`), {
    title: title,
    from: from,
    to: to,
  });
}
function resetform() {
  document.getElementById("date").value = "";
  document.getElementById("title").value = "";
  document.getElementById("from").value = "";
  document.getElementById("to").value = "";
}
function renderTasksForDay(selectedDay) {
  const user = auth.currentUser;
  const tasksRef = ref(database, `users/${user.uid}/tasks/${selectedDay}`);
  onValue(tasksRef, (snapshot) => {
    const tasksOfDay = snapshot.exists() ? Object.entries(snapshot.val()) : [];
    let taskListUl = document.querySelector(".tasklist ul");
    if (taskListUl) {
      taskListUl.innerHTML = "";
      tasksOfDay.forEach(([taskKey, task]) => {
        let li = document.createElement("li");
        li.className = "task-item";
        li.innerHTML = `
          <div class="time">${task.from} - ${task.to}</div>
          <label class="task-text">${task.title}</label>
          <div class="progress"></div>
          <input type="checkbox" class="circle-checkbox" onclick="changeproress(this)"/>
          <span class="delete-task" title="Xoá task" data-task-key="${taskKey}">&times;</span>
        `;
        li.querySelector(".delete-task").addEventListener(
          "click",
          function (e) {
            e.stopPropagation();
            deleteTask(user.uid, selectedDay, taskKey);
          }
        );
        taskListUl.appendChild(li);
      });
      Sortable.create(taskListUl, {
        animation: 150,
        ghostClass: "sortable-ghost",
      });
    }
  });
}
function deleteTask(uid, day, taskKey) {
  const taskRef = ref(database, `users/${uid}/tasks/${day}/${taskKey}`);
  set(taskRef, null);
}

let buttonday = document.getElementsByClassName("day-button");
for (let i = 0; i < buttonday.length; i++) {
  buttonday[i].addEventListener("click", function () {
    let selectedDay = this.getElementsByClassName("day-number")[0].innerText;
    renderTasksForDay(selectedDay);
  });
}

let noteTextarea = document.getElementById("inputText");
noteTextarea.addEventListener("input", function () {
  let selectedDate = document.querySelector(".day-button.clicked");
  let day = new Date().getDate();
  if (selectedDate) {
    day = selectedDate.querySelector(".day-number").innerText;
  }
  let user = auth.currentUser;
  let key = day;
  set(ref(database, `users/${user.uid}/notes/${key}`), noteTextarea.value);
});
function loadNoteForSelectedDay() {
  let selectedDate = document.querySelector(".day-button.clicked");
  let day;
  if (selectedDate) {
    day = selectedDate.querySelector(".day-number").innerText;
  }
  let noteTextarea = document.getElementById("inputText");
  if (!noteTextarea) return;
  let key = day;
  let user = auth.currentUser;
  const noteRef = ref(database, `users/${user.uid}/notes/${key}`);
  get(noteRef).then((snapshot) => {
    noteTextarea.value = snapshot.exists() ? snapshot.val() : "";
  });
}
setTimeout(loadNoteForSelectedDay, 5);
let dayButtons = document.getElementsByClassName("day-button");
for (let i = 0; i < dayButtons.length; i++) {
  dayButtons[i].addEventListener("click", function () {
    setTimeout(loadNoteForSelectedDay, 10);
  });
}
window.add = add;
document.getElementById("logoutBtn").addEventListener("click", function () {
  signOut(auth).then(() => (window.location.href = "./log/log.html"));
});
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  if (!user && !path.endsWith("/log/log.html")) {
    window.location.href = "/log/log.html";
  }
  if (user) {
    let dayselect = document.querySelector(".day-button.clicked");
    if (dayselect) {
      let selectedDay =
        dayselect.getElementsByClassName("day-number")[0].innerText;
      renderTasksForDay(selectedDay);
    }
  }
});
