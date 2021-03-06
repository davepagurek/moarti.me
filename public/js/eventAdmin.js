window.addEventListener("load", function() {
  var public = document.getElementById("link");
  var calculate = document.getElementById("calculate");
  var calculating = document.getElementById("calculating");
  var result = document.getElementById("result");
  
  var id = /event\/(.*)\/admin/.exec(document.URL)[1];
  
  link.value = document.URL.replace("admin", "view");
  link.addEventListener("click", function() {
    link.select();
  });
  
  var getEventInfo = function() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 ) {
        if(xmlhttp.status == 200){

          var result = JSON.parse(xmlhttp.responseText);
          document.getElementsByTagName("h2")[0].innerHTML = result.event.title;
          document.getElementsByTagName("title")[0].innerHTML = result.event.title;
          document.getElementById("hostImg").src = "/users/user/" + result.event.user.id + "/photo";
          
          var date = new Date(result.event.start);
          var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
          document.getElementById("date").innerHTML = month[date.getMonth()] + " " + date.getDate();
          result.event.attendees.forEach(function(attendee) {
            var person = document.createElement("div");
            person.className = "person";
            person.innerHTML = "<img src='/users/user/" + attendee.id + "/photo' class='thumbnail' /> " + attendee.displayName;
            document.getElementById("people").appendChild(person);
          });
          
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
  
  calculate.addEventListener("click", function() {
    hide(calculate);
    show(calculating);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 ) {
        if(xmlhttp.status == 200){

          var r = JSON.parse(xmlhttp.responseText);
          result.innerHTML = "";
          
          r.niceTimes.forEach(function(evt) {
            var option = document.createElement("div");
            option.className = "option";
            
            var s = new Date(evt.startTime);
            var start = document.createElement("div");
            start.innerHTML = "Start: " + (s.getHours()<10?"0":"") + s.getHours() + ":" + (s.getMinutes()<10?"0":"") + s.getMinutes();
            
            var e = new Date(evt.endTime);
            var end = document.createElement("div");
            end.innerHTML = "End: " + (e.getHours()<10?"0":"") + e.getHours() + ":" + (e.getMinutes()<10?"0":"") + e.getMinutes();
            
            option.appendChild(start);
            option.appendChild(end);
            
            result.appendChild(option);
          });
          
          hide(calculating);
          show(result);
          console.log(r);
        } else {
          console.log("error");
        }
      }
    };

    xmlhttp.open("POST", "calculate", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    setTimeout(function() {
      xmlhttp.send();
    }, 600);
  });
});