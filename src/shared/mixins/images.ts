export const center = (width: string, height: string) => {
  return `
    background-size: ${width} ${height};
    background-position: center;
    background-repeat: no-repeat;
  `;
};

export const custom = (
  width: string,
  height: string,
  left: string,
  top: string
) => {
  return `
    background-size: ${width} ${height};
    background-position: ${left} ${top};
    background-repeat: no-repeat;
  `;
};

export const cover = () => {
  return `
    background-size: cover;
    background-repeat: no-repeat;
  `;
};

export default {
  center,
  custom,
  cover
};
