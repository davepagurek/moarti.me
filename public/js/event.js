window.addEventListener("load", function() {

  var attending = document.getElementById("attending");
  var calendar = document.getElementById("calendar");
  var upload = document.getElementById("upload");
  
  var results = /event\/(.*)\/view/.exec(document.URL);
  var id = results[1];
  
  var getEventInfo = function() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 ) {
        if(xmlhttp.status == 200){

          var result = JSON.parse(xmlhttp.responseText);
          document.getElementsByTagName("h2")[0].innerHTML = result.event.title;
        } else {
          console.log("error");
        }
      }
    };

    xmlhttp.open("GET", "/events/event/" + id, true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
  }
  getEventInfo();
  
  attending.addEventListener("change", function() {
    if (attending.checked) {
      calendar.classList.add("open");
      show(upload);
    } else {
      calendar.classList.remove("open");
      hide(document.getElementById("sending"));
      hide(document.getElementById("success"));
    }
  });

  upload.addEventListener("click", function() {
    hide(upload);
    show(document.getElementById("sending"));
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 ) {
        if(xmlhttp.status == 200){

          var result = JSON.parse(xmlhttp.responseText);

          if (result.success) {
            hide(document.getElementById("sending"));
            show(document.getElementById("success"));
          } else {
            console.log("error");
          }
        } else {
          console.log("error");
        }
      }
    };

    xmlhttp.open("POST", "addCalendar", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
  });
});