window.onload = function () {
  const thu = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = new Date();
  const dayName = thu[day.getDay()];
  var buttonday = document.getElementsByClassName("day-button");
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
};
