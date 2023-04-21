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