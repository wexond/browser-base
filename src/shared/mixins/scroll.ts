export const noButtons = (
  width: string = '6px',
  color: string = 'rgba(0, 0, 0, 0.38)',
  hoverColor: string = 'rgba(0, 0, 0, 0.54)',
) => `
    &::-webkit-scrollbar {
      width: ${width};
    }

    &::-webkit-scrollbar-button {
      width: 0px;
      height: 0px;
    }

    &::-webkit-scrollbar-thumb {
      background: ${color};
      border: 0px none #ffffff;
      border-radius: 0px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: ${hoverColor};
    }

    &::-webkit-scrollbar-corner {
      background: transparent;
    }
  `;
