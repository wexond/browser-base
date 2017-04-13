function shadeColor(hex, lum) {
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;
    var rgb = "#",
        c,
        i;
    for (i = 0; i < 3; i++) {
        c = parseInt(hex.substr(i * 2, 2), 16);
        c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
        rgb += ("00" + c).substr(c.length);
    }
    return rgb;
}
function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1
        ? "0" + hex
        : hex;
}
function colorBrightness(color) {
    var r,
        g,
        b,
        brightness,
        colour = color;
    if (colour.match(/^rgb/)) {
        colour = colour.match(/rgba?\(([^)]+)\)/)[1];
        colour = colour.split(/ *, */).map(Number);
        r = colour[0];
        g = colour[1];
        b = colour[2];
    } else if ('#' == colour[0] && 7 == colour.length) {
        r = parseInt(colour.slice(1, 3), 16);
        g = parseInt(colour.slice(3, 5), 16);
        b = parseInt(colour.slice(5, 7), 16);
    } else if ('#' == colour[0] && 4 == colour.length) {
        r = parseInt(colour[1] + colour[1], 16);
        g = parseInt(colour[2] + colour[2], 16);
        b = parseInt(colour[3] + colour[3], 16);
    }
    brightness = (r * 299 + g * 587 + b * 114) / 1000;

    return brightness;
};
function hexToRgb(hex) {
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
        : null;
}
