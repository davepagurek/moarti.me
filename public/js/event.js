window.addEventListener("load", function() {
  var attending = document.getElementById("attending");
  var calendar = document.getElementById("calendar");
  attending.addEventListener("change", function() {
    console.log(attend.checked);
    if (attending.checked) {
      calendar.classList.add("open");
    } else {
      calendar.classList.remove("open");
    }
  });
});