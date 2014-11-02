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