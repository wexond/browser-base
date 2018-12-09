import { observer } from 'mobx-react';
import * as React from 'react';

import { StyledItem, Title, Icon } from './styles';

interface Props {
  icon: string;
  title: string;
  visible?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLDivElement>) => void;
}

@observer
export default class NavigationDrawerItem extends React.Component<Props, {}> {
  public static defaultProps = {
    visible: true,
  };

  public render() {
    const { icon, title, onClick, visible } = this.props;

    if (!visible) return null;

    return (
      <StyledItem onClick={onClick}>
        <Icon src={icon} />
        <Title>{title}</Title>
      </StyledItem>
    );
  }
}
