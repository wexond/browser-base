import * as React from 'react';

import { StyledSeparator } from './styles';

export interface IProps {
  visible?: boolean;
}

export default class MenuSeparator extends React.Component<IProps, {}> {
  public static defaultProps = {
    visible: true,
  };

  public render() {
    const { visible } = this.props;

    return <StyledSeparator visible={visible} />;
  }
}
