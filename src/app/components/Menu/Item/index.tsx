import React from 'react';

import {
  StyledItem, Icon, Title, Background, SubItemsContainer,
} from './styles';

import { MenuItems } from '../../../enums';

interface Props {
  icon: string;
  children?: any;
  subItem?: boolean;
  title: string;
  selected?: boolean;
  visible?: boolean;
  page?: MenuItems;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, element?: Item) => void;
}

export default class Item extends React.Component<Props, {}> {
  static defaultProps = {
    visible: true,
    selected: false,
    display: true,
  };

  private subItemsContainer: HTMLDivElement;

  private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(e, this);
    }
  };

  public render() {
    const {
      icon, children, subItem, visible, title,
    } = this.props;

    let { selected } = this.props;

    if (subItem) selected = false;

    let height = 0;

    React.Children.forEach(children, (el: React.ReactElement<any>) => {
      if (el.props.visible && selected) {
        height += 48;
      }
    });

    return (
      <div style={{ display: visible ? 'block' : 'none' }}>
        <StyledItem onClick={this.onClick} selected={selected}>
          <Background selected={selected} />
          <Icon selected={selected} subItem={subItem} image={icon} />
          <Title selected={selected}>{title}</Title>
        </StyledItem>
        <SubItemsContainer innerRef={r => (this.subItemsContainer = r)} style={{ height }}>
          {React.Children.map(children, (el: React.ReactElement<any>) =>
            React.cloneElement(el, { subItem: true }))}
        </SubItemsContainer>
      </div>
    );
  }
}
