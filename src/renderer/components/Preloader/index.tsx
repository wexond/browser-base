import * as React from 'react';

import { BLUE_500 } from '~/renderer/constants';
import { Path, StyledPreloader, Spinner } from './style';

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
        <Spinner
          stroke={color}
          viewBox="0 0 66 66"
          indeterminate={indeterminate}
        >
          <Path
            indeterminate={indeterminate}
            value={value}
            fill="none"
            strokeWidth={thickness}
            strokeLinecap="square"
            cx="33"
            cy="33"
            r="30"
          ></Path>
        </Spinner>
      </StyledPreloader>
    </div>
  );
};

Preloader.defaultProps = {
  thickness: 4,
  size: 48,
  color: BLUE_500,
};
