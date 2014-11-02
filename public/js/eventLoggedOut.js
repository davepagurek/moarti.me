window.addEventListener("load", function() {

  var attending = document.getElementById("attending");
  
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
});