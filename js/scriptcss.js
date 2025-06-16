function backgroundaddtask() {
  let addTaskList = document.getElementsByClassName("Addtasklist")[0];
  if (addTaskList.style.display == "none" || addTaskList.style.display == "") {
    addTaskList.style.display = "block";
  } else {
    addTaskList.style.display = "none";
  }
}

function changedatecss(buttonday) {
  let button = document.getElementsByClassName("day-button");
  for (let i = 0; i < button.length; i++) {
    button[i].classList.remove("clicked");
  }
  buttonday.classList.add("clicked");
}

function changeproress(checkbox) {
  let taskitem = checkbox.parentElement;
  if (checkbox.checked) {
    let progress = taskitem.getElementsByClassName("progress")[0];
    progress.innerText = "Finish";
    taskitem.classList.add("Finish");
  } else {
    let progress = taskitem.getElementsByClassName("progress")[0];
    if (taskitem.classList.contains("Overdue")) {
      progress.innerText = "Overdue";
    } else {
      progress.innerText = "";
    }
    taskitem.classList.remove("Finish");
  }
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
  taskItems.forEach(function (item) {
    let timeDiv = item.querySelector(".time");
    let progressDiv = item.querySelector(".progress");
    let checkbox = item.querySelector(".circle-checkbox");
    let times = timeDiv.innerText.split(" - ");
    let from = times[0].split(":");
    let to = times[1].split(":");
    let start = new Date(
      now.getFullYear(),
      now.getMonth(),
      day,
      parseInt(from[0]),
      parseInt(from[1])
    );
    let end = new Date(
      now.getFullYear(),
      now.getMonth(),
      day,
      parseInt(to[0]),
      parseInt(to[1])
    );
    item.classList.remove("Overdue");
    item.classList.remove("Finish");
    if (!checkbox.checked) progressDiv.innerText = "";

    if (checkbox.checked) {
      progressDiv.innerText = "Finish";
      item.classList.add("Finish");
    } else if (now > end) {
      progressDiv.innerText = "Overdue";
      item.classList.add("Overdue");
    } else {
      progressDiv.innerText = "";
    }
  });
}
setInterval(updateTaskStatus, 1000);
updateTaskStatus();
