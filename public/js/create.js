window.addEventListener("load", function() {
  var date = document.getElementById("date");
  var start = document.getElementById("start");
  date.addEventListener("input", function() {
    start.value = new Date(date.value).toISOString();
  });
});