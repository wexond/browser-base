export const centerIcon = (size: number | 'contain' = 'contain') => {
  let s: string = size.toString();

  if (typeof size === 'number') s += 'px';

  return `
    background-size: ${s};
    background-position: center;
    background-repeat: no-repeat;
`;
};

export const customImage = (
  width: string,
  height: string,
  left: string,
  top: string,
) => `
    background-size: ${width} ${height};
    background-position: ${left} ${top};
    background-repeat: no-repeat;
  `;

export const coverImage = () => `
    background-size: cover;
    background-repeat: no-repeat;
  `;
