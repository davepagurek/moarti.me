window.addEventListener("load", function() {
  var date = document.getElementById("date");
  var start = document.getElementById("start");
  var create = document.getElementById("create");
  var creating = document.getElementById("creating");
  var time = document.getElementById("time");
  
  create.getElementsByTagName("a")[0].addEventListener("click", function() {
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
    
    var d = new Date(date.value);
    var t = document.getElementById("early").value;
    var matches = /(.*):(.*)/.exec(t);
    d.setHours(parseInt(matches[1]));
    d.setMinutes(parseInt(matches[2]));
    var start = d.toISOString();
    
    var d2 = new Date(date.value);
    var t2 = document.getElementById("end").value;
    var matches2 = /(.*):(.*)/.exec(t2);
    d2.setHours(parseInt(matches2[1]));
    d2.setMinutes(parseInt(matches2[2]));
    var end = d.toISOString();

    var params = "title=" + encodeURIComponent(document.getElementById("name").value) + "&start=" + encodeURIComponent(start) + "&end=" + encodeURIComponent(end);
    xmlhttp.open("POST", "/events/new", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send(params);
  });
});