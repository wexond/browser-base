function isURL(s) {
    var regexp = /[a-zA-Z-0-9]+\.[a-zA-Z-0-9]{2,3}/;
    return regexp.test(s);
}
function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}
function autocomplete(input, text) {
    var inputText = input.value;
    if (text != null || text != "")
        if (text.toLowerCase().startsWith(inputText.toLowerCase())) {
            input.value = text;
            input.setSelectionRange(inputText.length, text.length);
        }
    }

function isInArray(value, array) {
    return array.indexOf(value) > -1;
}

function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
