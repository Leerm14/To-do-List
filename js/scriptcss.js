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
