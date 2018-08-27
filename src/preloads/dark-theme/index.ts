import { rgbToHex } from '../../utils/colors';

export const applyDarkTheme = () => {
  const elements = document.querySelectorAll('body'); // body *

  for (let i = 0; i < elements.length; i++) {
    colorize(elements[i]);
  }
};

export const colorize = (element: any) => {
  const style = window.getComputedStyle(element);
  const backgroundColor = style.getPropertyValue('background-color');
  const hasColor = backgroundColor !== 'rgba(0, 0, 0, 0)';

  if (hasColor) {
    console.log(element, backgroundColor);
    console.log(rgbToHex(backgroundColor));
  }
};
