import React from 'react';

import { colors } from '../../../defaults/colors';
import { ProgressType } from '../../../enums';
import { Indicator, Root, Track } from './styles';

export interface IProps {
  color?: string;
  type?: ProgressType;
  progress?: number;
}

export default class Button extends React.Component<IProps, {}> {
  public static defaultProps = {
    color: colors.deepPurple['500'],
    type: ProgressType.Indeterminate,
    progress: 50,
  };

  public render() {
    const { color, progress, type } = this.props;

    const firstIndicatorStyle = (type === ProgressType.Determinate && {
      width: `${progress}}%`,
    })
      || {};

    return (
      <Root>
        <Track color={color} />
        <Indicator type={type} color={color} style={firstIndicatorStyle} />
      </Root>
    );
  }
}
