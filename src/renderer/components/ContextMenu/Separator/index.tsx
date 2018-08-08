import * as React from 'react';

import { StyledSeparator } from './styles';

export interface IProps {
  i?: number;
  visible?: boolean;
  menuVisible?: boolean;
}

export default class MenuSeparator extends React.Component<IProps, {}> {

  public static defaultProps = {
    visible: true,
  };

  public state = {
    animation: false,
  };
  private timeout: any;

  public componentWillReceiveProps(nextProps: IProps) {
    const { menuVisible } = this.props;
    if (nextProps.menuVisible && !menuVisible) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.setState({ animation: true });
      },                        nextProps.i * 25);
    } else if (!nextProps.menuVisible) {
      clearTimeout(this.timeout);
      this.setState({ animation: false });
    }
  }

  public render() {
    const { visible } = this.props;
    const { animation } = this.state;

    return <StyledSeparator animation={animation} visible={visible} />;
  }
}
