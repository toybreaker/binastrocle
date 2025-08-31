// src/utils/main.ts
document.addEventListener('DOMContentLoaded', () => {
  console.log('BINastrOCLE MENU loaded!')
  // Auto-initialize the nav toggle
  initializeNavToggle();
})

/* code that SPEAKs: toggle nav */
export function toggleClass(element: HTMLElement | null, className: string): void {
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

export function initializeNavToggle(): void {
    const toggleButton = document.getElementById('toggle_works');
    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            if (document.body.classList.contains('showing_profile')) {
                toggleClass(document.getElementById('profile'), 'hide');
                toggleClass(document.body, 'showing_profile');
            }
            toggleClass(document.getElementById('menu'), 'hide');
            toggleClass(document.body, 'showing_menu');
        });
    }
}
