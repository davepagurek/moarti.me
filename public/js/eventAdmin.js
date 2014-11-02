window.addEventListener("load", function() {
  var public = document.getElementById("link");
  var calculate = document.getElementById("calculate");
  var calculating = document.getElementById("calculating");
  var result = document.getElementById("result");
  link.value = document.URL;
  link.addEventListener("click", function() {
    link.select();
  });
  
  calculate.addEventListener("click", function() {
    hide(calculate);
    show(calculating);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState == 4 ) {
        if(xmlhttp.status == 200){

          var result = JSON.parse(xmlhttp.responseText);

          if (result.success) {
            hide(calculating);
            show(result);
          } else {
            console.log("error");
          }
        } else {
          console.log("error");
        }
      }
    };

    xmlhttp.open("POST", "calculate", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
  });
});