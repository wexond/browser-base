function loadScripts(arr) {
    for (var i = 0; i < arr.length; i++) {
        var script = document.createElement('script');
        script.src = arr[i];
        document.body.appendChild(script);
    }
}
Element.prototype.addClass = function (cls) {
    this.classList.add(cls);
}
Element.prototype.removeClass = function (cls) {
    this.classList.remove(cls);
}


Element.prototype.css = function (data, value = null) {
    if (typeof(data) === 'object') {
        Object.assign(this.style, data);
    } else {
        if (value != null) {
            this.style[data] = value;
        }
        else {
            return this.style[data];
        }
    }
}

Element.prototype.left = function() {
    var rect = this.getBoundingClientRect();
    return rect.left;
}

Element.prototype.attr = function(attribute, value = null) {
    if (value != null) {
        this.setAttribute(attribute, value);
        return null;
    } else {
        return this.getAttribute(attribute);
    }
}

Element.prototype.next = function() {
    var nodes = Array.prototype.slice.call(this.parentNode.children),
        index = nodes.indexOf(this),
        nextElement = nodes[index + 1];
    return nextElement;
}
Element.prototype.prev = function() {
    var nodes = Array.prototype.slice.call(this.parentNode.children),
        index = nodes.indexOf(this);
        prevElement = nodes[index - 1];
    return prevElement;
}
