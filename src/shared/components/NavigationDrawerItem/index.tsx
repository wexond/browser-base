import { observer } from 'mobx-react';
import React from 'react';

import { StyledItem, Title, Icon } from './styles';

interface Props {
  icon: string;
  title: string;
  visible?: boolean;
  selected?: boolean;
  id?: number;
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
  onClick2?: (
    e?: React.MouseEvent<HTMLDivElement>,
    element?: NavigationDrawerItem,
  ) => void;
}

@observer
export default class NavigationDrawerItem extends React.Component<Props, {}> {
  public static defaultProps = {
    visible: true,
    selected: false,
  };

  private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onClick, onClick2 } = this.props;

    if (typeof onClick === 'function') onClick(e);
    if (typeof onClick2 === 'function') onClick2(e, this);
  };

  public render() {
    const { icon, title, selected } = this.props;

    return (
      <StyledItem onClick={this.onClick} selected={selected}>
        <Icon selected={selected} src={icon} />
        <Title selected={selected}>{title}</Title>
      </StyledItem>
    );
  }
}
