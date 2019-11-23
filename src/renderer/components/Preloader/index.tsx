import * as React from 'react';

import { BLUE_500 } from '~/renderer/constants';
import { Path, StyledPreloader } from './style';

export interface Props {
  style?: any;
  color?: string;
  thickness?: number;
  size?: number;
  indeterminate?: boolean;
  value?: number;
}

export const Preloader = ({
  style,
  color,
  size,
  thickness,
  value,
  indeterminate,
}: Props) => {
  return (
    <div style={style}>
      <StyledPreloader indeterminate={indeterminate} size={size}>
        <svg viewBox="25 25 50 50">
          <Path
            cx="50"
            cy="50"
            r="20"
            fill="none"
            strokeMiterlimit="10"
            color={color}
            thickness={thickness}
            indeterminate={indeterminate}
            value={value}
          />
        </svg>
      </StyledPreloader>
    </div>
  );
};

Preloader.defaultProps = {
  thickness: 4,
  size: 48,
  color: BLUE_500,
};
