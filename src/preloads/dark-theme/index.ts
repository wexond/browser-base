import { colorBrightness } from '../../utils/colors';

const backgroundBrightness = 189;

export const applyDarkTheme = () => {
  const elements = document.querySelectorAll('body, body *');

  for (let i = 0; i < elements.length; i++) {
    colorize(elements[i]);
  }
};

export const colorize = (element: any) => {
  const style = window.getComputedStyle(element);
  const backgroundColor = style.getPropertyValue('background-color');

  if (
    backgroundColor !== 'rgba(0, 0, 0, 0)' &&
    colorBrightness(backgroundColor) >= backgroundBrightness
  ) {
    element.style.backgroundColor = '#212121';
  }

  element.style.color = '#fff';
};
