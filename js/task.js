window.onload = function () {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  let taskItems = JSON.parse(localStorage.getItem("task")) || [];
  let filteredTasks = taskItems.filter(
    (task) => task.month === currentMonth && task.year === currentYear
  );
  if (filteredTasks.length !== taskItems.length) {
    localStorage.setItem("task", JSON.stringify(filteredTasks));
  }

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
  for (let i = 0; i < buttonday.length; i++) {
    let dayNum = parseInt(
      buttonday[i].getElementsByClassName("day-number")[0].innerText,
      10
    );
    week.push([dayNum, i]);
  }
  console.log(week);
  return week;
};

function add(x) {
  let day = document.getElementById("date").value;
  let id = parseInt(day.split("-")[2], 10);
  let title = document.getElementById("title").value;
  let from = document.getElementById("from").value;
  let to = document.getElementById("to").value;
  resetform();
  addtask(id, title, from, to);
  renderTasksForDay(id);
}
function addtask(id, title, from, to) {
  var taskItems = JSON.parse(localStorage.getItem("task")) || [];
  const now = new Date();
  taskItems.push({
    id: id,
    title: title,
    from: from,
    to: to,
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  localStorage.setItem("task", JSON.stringify(taskItems));
}
function resetform() {
  document.getElementById("date").value = "";
  document.getElementById("title").value = "";
  document.getElementById("from").value = "";
  document.getElementById("to").value = "";
}
function renderTasksForDay(selectedDay) {
  let taskItems = JSON.parse(localStorage.getItem("task")) || [];
  let tasksOfDay = taskItems.filter((task) => task.id === selectedDay);
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
}
let buttonday = document.getElementsByClassName("day-button");
for (let i = 0; i < buttonday.length; i++) {
  buttonday[i].addEventListener("click", function () {
    let selectedDay = parseInt(
      this.getElementsByClassName("day-number")[0].innerText,
      10
    );
    renderTasksForDay(selectedDay);
  });
}
