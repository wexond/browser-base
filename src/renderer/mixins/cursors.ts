import { transparency } from '../constants';

export const pointer = () => `
    user-select: none;
    cursor: pointer;
  `;

export const defaultCursor = () => `
    user-select: none;
    cursor: default;
  `;

export const coloredCursor = (cursorColor: string, color = 0) => `
  -webkit-text-fill-color: transparent;
  text-shadow: 0px 0px 0px rgba(${color}, ${color}, ${color}, ${transparency.text.high});
  color: ${cursorColor};
`;
