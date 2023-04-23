export function readFile(path) {
    let response;
    const xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.onload = function() {
        response = xhr.responseText;
    }
    xhr.send();
    return response;
}

export function scrollHeightListener(element, callback) {
    function listener(height, timeout) {
        if (height != element.offsetHeight) {
            callback();            
        }
        
        let prevHeight = element.offsetHeight;
        setTimeout( () => { listener(prevHeight, timeout) }, timeout)
    }

    listener(element.offsetHeight, 10)
}

export function getMobileUiElements(terminal) {
    const container = document.querySelector('.mobile-commands');
    // Проверка что это устройство с сенсорным экраном
    container.style.display = !!('ontouchstart' in window) ? 'block' : 'none';
    const tabsBox = document.querySelector('.mobile-commands__list');
    generate();

    let pressed = false;
    let startX;
    let scrollLeft;

    tabsBox.addEventListener('mousedown', start);
    tabsBox.addEventListener('touchstart', start);

    tabsBox.addEventListener('mousemove', move);
    tabsBox.addEventListener('touchmove', move);

    tabsBox.addEventListener('touchend', end);
    tabsBox.addEventListener('mouseup', end);
    tabsBox.addEventListener('mouseleave', end);

    function start(e) {
        pressed = true;
        startX = e.pageX || e.touches[0].pageX - tabsBox.offsetLeft;
        scrollLeft = tabsBox.scrollLeft;
    }

    function move(e) {
        if(!pressed) return;
        e.preventDefault();
        let x = e.pageX || e.touches[0].pageX - tabsBox.offsetLeft;
        tabsBox.scrollLeft = scrollLeft - (x - startX);
    }

    function end() {
        pressed = false;
    }

    function generate() {
        for (let command of Object.keys(terminal.commands)) {
            let tab = document.createElement('li');
            tab.classList.add('mobile-commands__item');
            tab.textContent = command;
            tab.addEventListener('click', () => {
                terminal.commandLine.textContent = command;
                terminal.inputHandler();
            });
            tabsBox.append(tab);
        }
    }
}