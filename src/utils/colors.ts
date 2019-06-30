// https://stackoverflow.com/a/13542669
export const shadeBlendConvert = function (
  this: any,
  p: any,
  from: any,
  to: any = null,
) {
  if (
    typeof p !== 'number' ||
    p < -1 ||
    p > 1 ||
    typeof from !== 'string' ||
    (from[0] !== 'r' && from[0] !== '#') ||
    (to && typeof to !== 'string')
  ) {
    return null;
  } // ErrorCheck
  if (!(this as any).sbcRip) {
    this.sbcRip = (d: any) => {
      const l = d.length;
      const RGB: any = {};

      if (l > 9) {
        d = d.split(',');
        if (d.length < 3 || d.length > 4) return null; // ErrorCheck
        (RGB[0] = i(d[0].split('(')[1])),
          (RGB[1] = i(d[1])),
          (RGB[2] = i(d[2])),
          (RGB[3] = d[3] ? parseFloat(d[3]) : -1);
      } else {
        if (l === 8 || l === 6 || l < 4) return null; // ErrorCheck
        if (l < 6) {
          d = `#${d[1]}${d[1]}${d[2]}${d[2]}${d[3]}${d[3]}${
            l > 4 ? `${d[4]}${d[4]}` : ''
          }`;
        } // 3 or 4 digit
        (d = i(d.slice(1), 16)),
          (RGB[0] = (d >> 16) & 255),
          (RGB[1] = (d >> 8) & 255),
          (RGB[2] = d & 255),
          (RGB[3] = -1);
        if (l === 9 || l === 5) {
          (RGB[3] = r((RGB[2] / 255) * 10000) / 10000),
            (RGB[2] = RGB[1]),
            (RGB[1] = RGB[0]),
            (RGB[0] = (d >> 24) & 255);
        }
      }
      return RGB;
    };
  }
  const i = parseInt;
  const r = Math.round;
  let h = from.length > 9;
  h =
    typeof to === 'string'
      ? to.length > 9
        ? true
        : to === 'c'
        ? !h
        : false
      : h;
  const b = p < 0;
  p = b ? p * -1 : p;
  to = to && to !== 'c' ? to : b ? '#000000' : '#FFFFFF';
  const f = this.sbcRip(from);
  const t = this.sbcRip(to);
  if (!f || !t) return null; // ErrorCheck
  if (h) {
    return `rgb${f[3] > -1 || t[3] > -1 ? 'a(' : '('}${r(
      (t[0] - f[0]) * p + f[0],
    )},${r((t[1] - f[1]) * p + f[1])},${r((t[2] - f[2]) * p + f[2])}${
      f[3] < 0 && t[3] < 0
        ? ')'
        : `,${
            f[3] > -1 && t[3] > -1
              ? r(((t[3] - f[3]) * p + f[3]) * 10000) / 10000
              : t[3] < 0
              ? f[3]
              : t[3]
          })`
    }`;
  }

  return `#${(
    0x100000000 +
    r((t[0] - f[0]) * p + f[0]) * 0x1000000 +
    r((t[1] - f[1]) * p + f[1]) * 0x10000 +
    r((t[2] - f[2]) * p + f[2]) * 0x100 +
    (f[3] > -1 && t[3] > -1
      ? r(((t[3] - f[3]) * p + f[3]) * 255)
      : t[3] > -1
      ? r(t[3] * 255)
      : f[3] > -1
      ? r(f[3] * 255)
      : 255)
  )
    .toString(16)
    .slice(1, f[3] > -1 || t[3] > -1 ? undefined : -2)}`;
};

export const getColorBrightness = (color: any) => {
  let r;
  let g;
  let b;

  if (color.match(/^rgb/)) {
    color = color.match(
      /^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/,
    );

    r = color[1];
    g = color[2];
    b = color[3];
  } else {
    color = +`0x${color.slice(1).replace(color.length < 5 && /./g, '$&$&')}`;

    r = color >> 16;
    g = (color >> 8) & 255;
    b = color & 255;
  }

  return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
};
