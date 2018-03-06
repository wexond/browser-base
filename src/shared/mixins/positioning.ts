import { Align } from "../enums";

export const center = (align: Align) => {
  switch (align) {
    case Align.CenterHorizontal:
      return `
        left: 50%;
        transform: translateX(-50%);
      `;
    case Align.CenterVertical:
      return `
        top: 50%;
        transform: translateY(-50%);
      `;
    case Align.CenterBoth:
      return `
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
      `;
  }
};

export default { center };
