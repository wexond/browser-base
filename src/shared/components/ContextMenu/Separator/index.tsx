import * as React from 'react';

import { StyledSeparator } from './styles';

export interface IProps {
  hide?: boolean;
  i?: number;
  visible?: boolean;
}

export default class MenuSeparator extends React.Component<IProps, {}> {
  private timeout: any;

  public state = {
    visible: false,
  };

  public componentWillReceiveProps(nextProps: IProps) {
    const { visible } = this.props;
    if (nextProps.visible && !visible) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setState({ visible: true });
      }, nextProps.i * 25);
    } else if (!nextProps.visible) {
      clearTimeout(this.timeout);
      this.setState({ visible: false });
    }
  }

  public render() {
    const { hide } = this.props;
    const { visible } = this.state;

    return <StyledSeparator visible={visible} hide={hide} />;
  }
}
