import styled from 'styled-components';

const getSize = (x: number, y: number, width: number, height: number, icon: number) => {
  if (width === 0 || height === 0) {
    return 0;
  }

  // Calculate points relative to the center of a component.
  const newX = x - width / 2;
  const newY = y - height / 2;

  let result = 2 * Math.abs(newY) + Math.abs(newX);

  if (Math.abs(newX) > Math.abs(newY)) {
    result = 2 * Math.abs(newX) + Math.abs(newY);
  }

  return Math.max(width, height) + result + (icon === 1 ? 0 : 10);
};

const easing = 'cubic-bezier(0.215, 0.61, 0.355, 1)';

export interface IProps {
  height: number;
  width: number;
  x: number;
  y: number;
  color: string;
  opacity: number;
  rippleTime: number;
  fadeOutTime: number;
  icon: number;
}

export const StyledRipple = styled.div.attrs({
  style: ({
    x, y, width, height, icon, opacity,
  }: any) => {
    const newX = Math.min(x, width);
    const size = getSize(x, y, width, height, icon);

    return {
      left: newX,
      top: y,
      height: size,
      width: size,
      opacity,
    };
  },
})`
  position: absolute;
  border-radius: 50%;
  transform: translate3d(-50.1%, -50.1%, 0);
  overflow: hidden;
  pointer-events: none;

  transition: ${({ rippleTime }: IProps) => rippleTime}s width ${easing},
    ${({ rippleTime }) => rippleTime}s height ${easing},
    ${({ fadeOutTime }) => fadeOutTime}s opacity, 0.3s background-color;
  background-color: ${({ color }) => color};
`;
