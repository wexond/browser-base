import { observer } from 'mobx-React';
import React from 'react';

import store from '../../../../store';
import {
  Background, Icon, StyledItem, SubItemsContainer, Title,
} from './styles';

interface Props {
  icon: string;
  children?: any;
  isSubItem?: boolean;
  title: string;
  visible?: boolean;
  searchVisible?: boolean;
  id?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, element?: Item) => void;
}

@observer
export default class Item extends React.Component<Props, {}> {
  public static defaultProps = {
    visible: true,
    selected: false,
    display: true,
  };

  private subItemsContainer: HTMLDivElement;

  public render() {
    const {
      icon, children, isSubItem, visible, title, id,
    } = this.props;

    let selected = false;

    if (!isSubItem) {
      selected = store.menu.selectedItem === id;
    }

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
          <Icon selected={selected} subItem={isSubItem} image={icon} />
          <Title selected={selected}>{title}</Title>
        </StyledItem>
        <SubItemsContainer innerRef={(r) => (this.subItemsContainer = r)} style={{ height }}>
          {React.Children.map(children, (el: React.ReactElement<any>) =>
            React.cloneElement(el, { isSubItem: true }))}
        </SubItemsContainer>
      </div>
    );
  }

  private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(e, this);
    }
  }
}
