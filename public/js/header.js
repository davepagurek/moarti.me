window.addEventListener("load", function() {
  var getEventInfo = function() {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 ) {
        if(xmlhttp.status == 200){

          var result = JSON.parse(xmlhttp.responseText);
          
          document.getElementById("me").getElementsByTagName("img")[0].src = "/users/user/" + result.user._id + "/photo";
          
        } else {
          console.log("error");
        }
      }
    };

    xmlhttp.open("GET", "/users/profile/", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
  }
  getEventInfo();
});