window.addEventListener("load", function() {
  var date = document.getElementById("date");
  var start = document.getElementById("start");
  var create = document.getElementById("create");
  var creating = document.getElementById("creating");
  date.addEventListener("input", function() {
    start.value = new Date(date.value).toISOString();
  });
  
  create.addEventListener("click", function() {
    hide(create);
    show(creating);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 ) {
        if(xmlhttp.status == 200){

          var result = JSON.parse(xmlhttp.responseText);

          if (result.success) {
            window.location.href = "/events/event/" + result.id + "/admin";
          } else {
            console.log("error");
          }
        } else {
          console.log("error");
        }
      }
    };

    var params = "title=" + encodeURIComponent(document.getElementById("name").value) + "&start=" + encodeURIComponent(start.value);
    xmlhttp.open("POST", "/events/new", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
  });
});