export const center = (width: string, height: string) => `
    background-size: ${width} ${height};
    background-position: center;
    background-repeat: no-repeat;
  `;

export const custom = (width: string, height: string, left: string, top: string) => `
    background-size: ${width} ${height};
    background-position: ${left} ${top};
    background-repeat: no-repeat;
  `;

export const cover = () => `
    background-size: cover;
    background-repeat: no-repeat;
  `;

export default {
  center,
  custom,
  cover,
};
