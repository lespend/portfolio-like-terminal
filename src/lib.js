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