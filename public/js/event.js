window.addEventListener("load", function() {

  var attending = document.getElementById("attending");
  var calendar = document.getElementById("calendar");
  var upload = document.getElementById("upload");
  
  var id = /event\/(.*)\/view/.exec(document.URL)[1];
  
  var getEventInfo = function() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 ) {
        if(xmlhttp.status == 200){

          var result = JSON.parse(xmlhttp.responseText);
          document.getElementsByTagName("h2")[0].innerHTML = result.event.title;
          document.getElementsByTagName("title")[0].innerHTML = result.event.title;
          document.getElementById("host").innerHTML = result.event.user.displayName;
          document.getElementById("hostImg").src = "/users/user/" + result.event.user.id + "/photo";
          
          var date = new Date(result.event.start);
          var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          document.getElementById("date").innerHTML = month[date.getMonth()] + " " + date.getDate();
          document.getElementById("attendees").innerHTML = result.event.attendees.length + (result.event.attendees.length==1?" person is":" people are") + " attending";
          Array.prototype.forEach.call(document.getElementsByClassName("section"), function(element) {
            element.classList.remove("hidden");
          });
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

  upload.getElementsByTagName("a")[0].addEventListener("click", function() {
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
    setTimeout(function() {
      xmlhttp.send();
    }, 600);
  });
});