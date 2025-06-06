window.onload = function () {
  const thu = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const day = new Date();
  const dayName = thu[day.getDay()];
  var buttonday = document.getElementsByClassName("day-button");
  console.log(day.getDate());
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
  var b = note;
  var count = 1;
  while (count <= 7) {
    note++;
    if (note <= 6) {
      buttonday[note].getElementsByClassName("day-number")[0].innerText =
        day.getDate() + count;
      count++;
    } else {
      var a = 6 - note;
      buttonday[b + a].getElementsByClassName("day-number")[0].innerText =
        day.getDate() + a;
      count++;
    }
  }
};
