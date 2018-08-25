import React from 'react';

import { Indicator, Root, Track } from './styles';
import { colors } from '~/renderer/defaults';

export interface IProps {
  color?: string;
  determinate?: boolean;
  indeterminate?: boolean;
  progress?: number;
}

export default class Button extends React.Component<IProps, {}> {
  public static defaultProps: IProps = {
    color: colors.deepPurple['500'],
    indeterminate: false,
    determinate: false,
    progress: 50,
  };

  public render() {
    const { color, progress, determinate, indeterminate } = this.props;

    const firstIndicatorStyle =
      (determinate && {
        width: `${progress}}%`,
      }) ||
      {};

    return (
      <Root>
        <Track color={color} />
        <Indicator
          indeterminate={indeterminate}
          color={color}
          style={firstIndicatorStyle}
        />
      </Root>
    );
  }
}
