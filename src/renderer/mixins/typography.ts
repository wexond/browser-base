import {
  FONT_ROBOTO_REGULAR,
  FONT_ROBOTO_MEDIUM,
  FONT_ROBOTO_LIGHT,
} from '../constants';

export const getLetterSpacing = (fontSize: number, tracking: number) =>
  tracking / fontSize;

export const robotoLight = () => `
  font-family: Roboto;
  font-weight: 300;
`;

export const robotoRegular = () => `
  font-family: Roboto;
  font-weight: 400;
`;

export const robotoMedium = () => `
  font-family: Roboto;
  font-weight: 500;
`;

export const h1 = () => `
  ${robotoLight()};
  letter-spacing: ${getLetterSpacing(96, -1.5)}rem;
  font-size: 96px;
`;

export const h2 = () => `
  ${robotoLight()};
  letter-spacing: ${getLetterSpacing(60, -0.5)}rem;
  font-size: 60px;
`;

export const h3 = () => `
  ${robotoRegular()};
  letter-spacing: ${getLetterSpacing(48, 0)}rem;
  font-size: 48px;
`;

export const h4 = () => `
  ${robotoRegular()};
  letter-spacing: ${getLetterSpacing(34, 0.25)}rem;
  font-size: 34px;
`;

export const h5 = () => `
  ${robotoRegular()};
  letter-spacing: ${getLetterSpacing(24, 0)}rem;
  font-size: 24px;
`;

export const h6 = () => `
  ${robotoMedium()};
  letter-spacing: ${getLetterSpacing(20, 0.15)}rem;
  font-size: 20px;
`;

export const subtitle1 = () => `
  ${robotoRegular()};
  letter-spacing: ${getLetterSpacing(16, 0.15)}rem;
  font-size: 16px;
`;

export const subtitle2 = () => `
  ${robotoMedium()};
  letter-spacing: ${getLetterSpacing(14, 0.1)}rem;
  font-size: 14px;
`;

export const body1 = () => `
  ${robotoRegular()};
  letter-spacing: ${getLetterSpacing(16, 0.5)}rem;
  font-size: 16px;
`;

export const body2 = () => `
  ${robotoRegular()};
  letter-spacing: ${getLetterSpacing(14, 0.25)}rem;
  font-size: 14px;
`;

export const button = () => `
  ${robotoMedium()};
  letter-spacing: ${getLetterSpacing(14, 0.75)}rem;
  font-size: 14px;
`;

export const caption = () => `
  ${robotoRegular()};
  letter-spacing: ${getLetterSpacing(12, 0.4)}rem;
  font-size: 12px;
`;

export const overline = () => `
  ${robotoRegular()};
  letter-spacing: ${getLetterSpacing(10, 1.5)}rem;
  font-size: 10px;
  text-transform: uppercase;
`;

export const maxLines = (count: number, lineHeight?: number) => `
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${count};
  -webkit-box-orient: vertical;
`;

export const injectFonts = () => {
  const styleElement = document.createElement('style');

  styleElement.textContent = `
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 400;
  src: url(${FONT_ROBOTO_REGULAR}) format('woff2');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 500;
  src: url(${FONT_ROBOTO_MEDIUM}) format('woff2');
}
@font-face {
  font-family: 'Roboto';
  font-style: normal;
  font-weight: 300;
  src: url(${FONT_ROBOTO_LIGHT}) format('woff2');
}
`;

  document.head.appendChild(styleElement);
};
