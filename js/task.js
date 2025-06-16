import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  push,
  onValue,
  get,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-database.js";
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
  let day = document.getElementById("date").value;
  let id = parseInt(day.split("-")[2], 10);
  let title = document.getElementById("title").value;
  let from = document.getElementById("from").value;
  let to = document.getElementById("to").value;
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
  push(ref(database, "task/" + day), {
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
  onValue(ref(database, "task/"), (snapshot) => {
    const data = snapshot.val() || {};
    const dayTask = data[selectedDay] || {};
    const tasksOfDay = Object.values(dayTask);
    let taskListUl = document.querySelector(".tasklist ul");
    if (taskListUl) {
      taskListUl.innerHTML = "";
      if (tasksOfDay.length === 0) {
        taskListUl.innerHTML = "";
      } else {
        tasksOfDay.forEach((task) => {
          let li = document.createElement("li");
          li.className = "task-item";
          li.innerHTML = `
            <div class="time">${task.from} - ${task.to}</div>
            <label class="task-text">${task.title}</label>
            <div class="progress"></div>
            <input type="checkbox" id="task-text" class="circle-checkbox" onclick="changeproress(this)"/>
          `;
          taskListUl.appendChild(li);
        });
        Sortable.create(taskListUl, {
          animation: 150,
          ghostClass: "sortable-ghost",
        });
      }
    }
  });
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
  let key = day;
  set(ref(database, "note/" + key), noteTextarea.value);
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
  const noteRef = ref(database, "note/" + key);
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
