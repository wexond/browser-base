import React from 'react';
import { StyledItem, Icon, Title, Background } from './styles';

import { NavigationDrawerItems } from '../../../enums';

interface Props {
  icon: string;
  children?: any;
  subItem?: boolean;
  title: string;
  selected?: boolean;
  visible?: boolean;
  display?: boolean;
  page?: NavigationDrawerItems;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, element?: Item) => void;
}

export default class Item extends React.Component<Props, {}> {
  static defaultProps = {
    visible: true,
    selected: false,
    display: true,
  };

  private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(e, this);
    }
  };

  public render() {
    const {
      icon, children, subItem, visible, title, display,
    } = this.props;

    let { selected } = this.props;

    if (subItem) selected = false;

    return (
      <div style={{ display: display && visible ? 'block' : 'none'}}>
        <StyledItem onClick={this.onClick} selected={selected}>
          <Background selected={selected} />
          <Icon selected={selected} subItem={subItem} image={icon} />
          <Title selected={selected}>{title}</Title>
        </StyledItem>
        {React.Children.map(children, (el: React.ReactElement<any>) =>
          React.cloneElement(el, { subItem: true, visible: selected }))}
      </div>
    );
  }
}
