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
function selectedDay() {
  let selectedDate = document.querySelector(".day-button.clicked");
  let today = new Date();
  let btnDay = today.getDate();
  if (selectedDate) {
    btnDay = selectedDate.querySelector(".day-number").innerText;
    btnDay = parseInt(btnDay, 10);
  }
  let btnDate = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), btnDay)
  );
  return btnDate.toISOString().slice(0, 10);
}
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
  renderTasksForDay(selectedDay());
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
  const repeat = document.getElementById("repeat").value;
  const warning = document.getElementById("task-warning");
  // 0:unfinish  1:finish 2:overdue
  let status = 0;
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
  resetform();
  if (repeat === "none") {
    addtask(day, title, from, to, status, repeat);
  } else {
    let startDate = new Date(day);
    if (repeat === "daily") {
      let repeatCount = 365;
      for (let i = 0; i < repeatCount; i++) {
        let targetDate = new Date(startDate);
        targetDate.setDate(startDate.getDate() + i);
        let dayKey = targetDate.toISOString().slice(0, 10);
        addtask(dayKey, title, from, to, status, repeat);
      }
    } else if (repeat === "weekly") {
      let repeatCount = 52;
      for (let i = 0; i < repeatCount; i++) {
        let targetDate = new Date(startDate);
        targetDate.setDate(startDate.getDate() + i * 7);
        let dayKey = targetDate.toISOString().slice(0, 10);
        addtask(dayKey, title, from, to, status, repeat);
      }
    }
  }
  renderTasksForDay(selectedDay());
}
function addtask(dayKey, title, from, to, status, repeat = "none") {
  const user = auth.currentUser;
  push(ref(database, `users/${user.uid}/tasks/${dayKey}`), {
    title: title,
    from: from,
    to: to,
    status: status,
    repeat: repeat,
  });
}
function resetform() {
  document.getElementById("date").value = "";
  document.getElementById("title").value = "";
  document.getElementById("from").value = "";
  document.getElementById("to").value = "";
  document.getElementById("repeat").value = "none";
}
function renderTasksForDay(selectedDayKey) {
  const user = auth.currentUser;
  if (!user) return;
  const tasksRef = ref(database, `users/${user.uid}/tasks/${selectedDayKey}`);
  onValue(tasksRef, (snapshot) => {
    const tasksOfDay = snapshot.exists() ? Object.entries(snapshot.val()) : [];
    let taskListUl = document.querySelector(".tasklist ul");
    if (taskListUl) {
      taskListUl.innerHTML = "";
      let filter = "all";
      const filterSelect = document.getElementById("filterStatus");
      if (filterSelect) filter = filterSelect.value;
      tasksOfDay.forEach(([taskKey, task]) => {
        if (
          (filter === "unfinished" && task.status !== 0) ||
          (filter === "finished" && task.status !== 1) ||
          (filter === "overdue" && task.status !== 2)
        ) {
          return;
        }
        let li = document.createElement("li");
        li.className = "task-item";
        if (task.status === 1) {
          li.classList.add("Finish");
        } else if (task.status === 2) {
          li.classList.add("Overdue");
        }
        li.innerHTML = `
          <div class="time">${task.from} - ${task.to}</div>
          <label class="task-text">${task.title}</label>
          <div class="progress">${
            task.status === 1 ? "Finish" : task.status === 2 ? "Overdue" : ""
          }</div>
          <input type="checkbox" class="circle-checkbox" onclick="changeproress(this)" ${
            task.status === 1 ? "checked" : ""
          }/>
          <span class="delete-task" title="Xoá task" data-task-key="${taskKey}">&times;</span>
        `;
        li.querySelector(".delete-task").addEventListener(
          "click",
          function (e) {
            e.stopPropagation();
            deleteTask(user.uid, selectedDayKey, taskKey);
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
    const dayKey = selectedDay();
    renderTasksForDay(dayKey);
  });
}

let noteTextarea = document.getElementById("inputText");
noteTextarea.addEventListener("input", function () {
  let user = auth.currentUser;
  let key = selectedDay();
  set(ref(database, `users/${user.uid}/notes/${key}`), noteTextarea.value);
});
function loadNoteForSelectedDay() {
  let noteTextarea = document.getElementById("inputText");
  if (!noteTextarea) return;
  let key = selectedDay();
  let user = auth.currentUser;
  if (!user) return;
  const noteRef = ref(database, `users/${user.uid}/notes/${key}`);
  get(noteRef).then((snapshot) => {
    noteTextarea.value = snapshot.exists() ? snapshot.val() : "";
  });
}
setTimeout(loadNoteForSelectedDay, 20);
let dayButtons = document.getElementsByClassName("day-button");
for (let i = 0; i < dayButtons.length; i++) {
  dayButtons[i].addEventListener("click", function () {
    setTimeout(loadNoteForSelectedDay, 10);
  });
}
document.getElementById("logoutBtn").addEventListener("click", function () {
  signOut(auth).then(() => (window.location.href = "./log/log.html"));
});
const filterSelect = document.getElementById("filterStatus");
if (filterSelect) {
  filterSelect.addEventListener("change", function () {
    renderTasksForDay(selectedDay());
  });
}
function changeproress(checkbox) {
  let taskitem = checkbox.parentElement;
  let progress = taskitem.getElementsByClassName("progress")[0];
  let user = auth.currentUser;
  let dayKey = selectedDay();
  let deleteBtn = taskitem.querySelector(".delete-task");
  let taskKey = deleteBtn ? deleteBtn.getAttribute("data-task-key") : null;
  if (!user || !taskKey) return;
  let newStatus = 0;
  if (checkbox.checked) {
    progress.innerText = "Finish";
    taskitem.classList.add("Finish");
    newStatus = 1;
  } else {
    if (taskitem.classList.contains("Overdue")) {
      progress.innerText = "Overdue";
      newStatus = 2;
    } else {
      progress.innerText = "";
      newStatus = 0;
    }
    taskitem.classList.remove("Finish");
  }
  const taskRef = ref(
    database,
    `users/${user.uid}/tasks/${dayKey}/${taskKey}/status`
  );
  set(taskRef, newStatus);
}

function updateTaskStatus() {
  let taskItems = document.querySelectorAll(".task-item");
  let now = new Date();
  let selectedDate = document.querySelector(".day-button.clicked");
  let day = now.getDate();
  if (selectedDate) {
    day = selectedDate.querySelector(".day-number").innerText;
    day = parseInt(day, 10);
  }
  let user = auth.currentUser;
  let dayKey = selectedDay();
  let updated = false;
  taskItems.forEach(function (item) {
    let timeDiv = item.querySelector(".time");
    let progressDiv = item.querySelector(".progress");
    let deleteBtn = item.querySelector(".delete-task");
    let taskKey = deleteBtn ? deleteBtn.getAttribute("data-task-key") : null;
    let times = timeDiv.innerText.split(" - ");
    let to = times[1].split(":");
    let end = new Date(
      now.getFullYear(),
      now.getMonth(),
      day,
      parseInt(to[0]),
      parseInt(to[1])
    );
    if (now > end) {
      if (user && taskKey) {
        if (!item.classList.contains("Finish")) {
          const taskRef = ref(
            database,
            `users/${user.uid}/tasks/${dayKey}/${taskKey}/status`
          );
          if (progressDiv.innerText !== "Overdue") {
            set(taskRef, 2);
            updated = true;
            console.log("Task marked as overdue:", taskKey);
          }
        }
      }
    }
  });
  if (updated) {
    console.log("Updating tasks for the day:", dayKey);
    renderTasksForDay(dayKey);
  }
}
setInterval(updateTaskStatus, 5000);
updateTaskStatus();
onAuthStateChanged(auth, (user) => {
  const path = window.location.pathname;
  if (!user && !path.endsWith("/log/log.html")) {
    window.location.href = "/log/log.html";
  }
  if (user) {
    renderTasksForDay(selectedDay());
  }
});
window.add = add;
window.changeproress = changeproress;
