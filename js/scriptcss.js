function backgroundaddtask() {
  var addTaskList = document.getElementsByClassName("Addtasklist")[0];
  if (addTaskList.style.display == "none" || addTaskList.style.display == "") {
    addTaskList.style.display = "block";
  } else {
    addTaskList.style.display = "none";
  }
}

function changedatecss(buttonday) {
  var button = document.getElementsByClassName("day-button");
  for (var i = 0; i < button.length; i++) {
    button[i].classList.remove("clicked");
  }
  buttonday.classList.add("clicked");
}

function changeproress(checkbox) {
  var taskitem = checkbox.parentElement;
  if (checkbox.checked) {
    var progress = taskitem.getElementsByClassName("progress")[0];
    progress.innerText = "Finish";
    taskitem.classList.add("Finish");
  } else {
    var progress = taskitem.getElementsByClassName("progress")[0];
    if (taskitem.classList.contains("Overdue")) {
      progress.innerText = "Overdue";
    } else {
      progress.innerText = "";
    }
    taskitem.classList.remove("Finish");
  }
}

function updateTaskStatus() {
  var taskItems = document.querySelectorAll(".task-item");
  var now = new Date();
  taskItems.forEach(function (item) {
    var timeDiv = item.querySelector(".time");
    var progressDiv = item.querySelector(".progress");
    var checkbox = item.querySelector(".circle-checkbox");
    var day = now.getDate();
    var times = timeDiv.innerText.split(" - ");
    var from = times[0].split(":");
    var to = times[1].split(":");
    var start = new Date(
      now.getFullYear(),
      now.getMonth(),
      day,
      parseInt(from[0]),
      parseInt(from[1])
    );
    var end = new Date(
      now.getFullYear(),
      now.getMonth(),
      day,
      parseInt(to[0]),
      parseInt(to[1])
    );
    console.log("Start: " + start);
    console.log("End: " + end);
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
setInterval(updateTaskStatus, 30000);
updateTaskStatus();
