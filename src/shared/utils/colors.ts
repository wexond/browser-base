export const hexToRgb = (hex: string) => {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

export const colorBrightness = (color: string) => {
  if (color == null) {
    return null;
  }

  let r;
  let g;
  let b;
  let colour: any = color;

  if (colour.match(/^rgb/)) {
    colour = colour.match(/rgba?\(([^)]+)\)/)[1];
    colour = colour.split(/ *, */).map(Number);

    r = colour[0];
    g = colour[1];
    b = colour[2];
  } else if (colour[0] === '#' && colour.length === 7) {
    r = parseInt(colour.slice(1, 3), 16);
    g = parseInt(colour.slice(3, 5), 16);
    b = parseInt(colour.slice(5, 7), 16);
  } else if (colour[0] === '#' && colour.length === 4) {
    r = parseInt(colour[1] + colour[1], 16);
    g = parseInt(colour[2] + colour[2], 16);
    b = parseInt(colour[3] + colour[3], 16);
  }

  return (r * 299 + g * 587 + b * 114) / 1000;
};

export const getForegroundColor = (color: string) => {
  const brightness = colorBrightness(color);

  if (brightness < 130) {
    return 'white';
  }
  return 'black';
};

export const decToHex = (num: string | number) => {
  return Number(num)
    .toString(16)
    .padStart(2, '0');
};

export const rgbToHex = (color: string) => {
  if (color.startsWith('rgb(') && color.endsWith(')')) {
    color = color.slice(4, color.length - 1);
    const colors = color.split(',');

    return `#${decToHex(colors[0])}${decToHex(colors[1])}${decToHex(
      colors[2],
    )}`;
  }

  return null;
};
