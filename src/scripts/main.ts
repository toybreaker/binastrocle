// src/scripts/main.js
// Your existing vanilla JavaScript - removed 'javascript' keyword
// This file is served as-is, no processing
document.addEventListener('DOMContentLoaded', () => {
  console.log('BINASTROCLE loaded!')
})



/* code that SPEAKs: toggle menu */
function toggleClass(element, className){
    if (!element || !className){
        return;
    }

    var classString = element.className, nameIndex = classString.indexOf(className);
    if (nameIndex == -1) {
        classString += ' ' + className;
    }
    else {
        classString = classString.substr(0, nameIndex) + classString.substr(nameIndex+className.length);
    }
    element.className = classString;
}

document.getElementById('toggle_works').addEventListener('click', function() {
  if (document.body.classList.contains('showing_profile')) {
      toggleClass(document.getElementById('profile'), 'hide'),
      toggleClass(document.body, 'showing_profile');
  }
  toggleClass(document.getElementById('menu'), 'hide'),
  toggleClass(document.body, 'showing_menu');
});
