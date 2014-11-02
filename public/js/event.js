var hide = function(element) {
  element.style.overflow = "hidden";
  element.style.height = getComputedStyle(element).height;
  element.style.transition = 'all .5s ease';
  element.offsetHeight = "" + element.offsetHeight; // force repaint
  element.style.height = '0';
  element.style.marginTop = "0";
  element.style.marginBottom = "0";
};
var show = function(element) {
  var prevHeight = "0";
  element.style.height = 'auto';
  var endHeight = getComputedStyle(element).height;
  element.style.height = prevHeight;
  element.offsetHeight = "" + element.offsetHeight; // force repaint
  element.style.transition = 'all .5s ease';
  element.style.height = endHeight;
  element.style.marginTop = "";
  element.style.marginBottom = "";
  element.addEventListener('transitionend', function transitionEnd(event) {
    if (event.propertyName == 'height') {
      this.style.transition = '';
      this.style.height = 'auto';
      this.removeEventListener('transitionend', transitionEnd, false);
      this.style.overflow = "visible";
    }
  }, false);
};

window.addEventListener("load", function() {

  var attending = document.getElementById("attending");
  var calendar = document.getElementById("calendar");
  var upload = document.getElementById("upload");
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

    xmlhttp.open("GET", "addCalendar", true);
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xmlhttp.send();
  });
});