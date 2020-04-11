// @ts-nocheck

/* eslint-disable @typescript-eslint/ban-ts-ignore */
// https://stackoverflow.com/a/13542669

export const getColorBrightness = (color: string) => {
  let r: number;
  let g;
  let b;

  if (color.match(/^rgb/)) {
    const match = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
    );

    r = parseInt(match[1]);
    g = parseInt(match[2]);
    b = parseInt(match[3]);
  } else {
    const num = +`0x${color
      .slice(1)
      .replace(color.length < 5 && /./g, '$&$&')}`;

    r = num >> 16;
    g = (num >> 8) & 255;
    b = num & 255;
  }

  return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
};

const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
};

export const rgbToHex = (rgba: number[]) => {
  return (
    '#' +
    componentToHex(Math.round(rgba[0])) +
    componentToHex(Math.round(rgba[1])) +
    componentToHex(Math.round(rgba[2]))
  );
};
