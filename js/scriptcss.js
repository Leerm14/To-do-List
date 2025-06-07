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
