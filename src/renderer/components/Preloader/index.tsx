import * as React from 'react';

import { colors } from '../../../defaults/colors';
import { Path, StyledPreloader } from './styles';

export interface IProps {
  style?: any;
  color?: string;
  thickness?: number;
  size?: number;
}

export default class Preloader extends React.Component<IProps, {}> {
  public static defaultProps = {
    thickness: 4,
    size: 48,
    color: colors.blue['500'],
  };

  public render() {
    const { style, color, size, thickness } = this.props;

    return (
      <div style={style}>
        <StyledPreloader size={size}>
          <svg viewBox="25 25 50 50">
            <Path
              cx="50"
              cy="50"
              r="20"
              fill="none"
              strokeMiterlimit="10"
              color={color}
              thickness={thickness}
            />
          </svg>
        </StyledPreloader>
      </div>
    );
  }
}
