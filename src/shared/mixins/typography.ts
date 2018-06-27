const body1 = () => `
  font-size: 13px;
  font-family: Roboto;
  font-weight: 400;
`;

const body2 = () => `
  font-size: 14px;
  font-family: Roboto;
  font-weight: 500;
`;

const button = () => `
  font-size: 14px;
  font-family: Roboto;
  font-weight: 500;
`;

const robotoLight = () => `
  font-family: Roboto;
  font-weight: 300;
`;

const robotoRegular = () => `
  font-family: Roboto;
  font-weight: 400;
`;

const robotoMedium = () => `
  font-family: Roboto;
  font-weight: 500;
`;

const maxLines = (count: number) => `
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: ${count};
  -webkit-box-orient: vertical;
`;

export default {
  body1,
  body2,
  button,
  robotoLight,
  robotoRegular,
  robotoMedium,
  maxLines,
};
