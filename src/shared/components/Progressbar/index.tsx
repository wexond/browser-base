import * as React from 'react';

import colors from '../../defaults/colors';
import { ProgressType } from '../../enums';

import { Root, Track, Indicator } from './styles';

export interface IProps {
  color?: string;
  type?: ProgressType;
  progress?: number;
}

export default class Button extends React.Component<IProps, {}> {
  public static defaultProps = {
    color: colors.deepPurple['500'],
    type: ProgressType.Determinate,
    progress: 50,
  };

  public render() {
    const { color, progress, type } = this.props;

    const indicatorStyle = {
      width: `${progress}}%`,
    };

    return (
      <Root>
        <Track color={color} />
        <Indicator color={color} style={indicatorStyle} />
      </Root>
    );
  }
}
