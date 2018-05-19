import React from 'react';
import { StyledItem, Icon, Title, Background } from './styles';

import { NavigationDrawerItems } from '../../../enums';

interface Props {
  icon: string;
  children: any;
  subItem?: boolean;
  selected?: boolean;
  visible?: boolean;
  page?: NavigationDrawerItems;
  onClick?: (e: React.MouseEvent<HTMLDivElement>, element?: Item) => void;
}

export default class Item extends React.Component<Props, {}> {
  static defaultProps = {
    visible: true,
    selected: false,
  };

  private onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { onClick } = this.props;

    if (typeof onClick === 'function') {
      onClick(e, this);
    }
  };

  public render() {
    const {
      icon, children, subItem, visible,
    } = this.props;

    let { selected } = this.props;

    if (subItem) selected = false;

    return (
      <React.Fragment>
        <StyledItem onClick={this.onClick} visible={visible} selected={selected}>
          <Background selected={selected} />
          <Icon selected={selected} subItem={subItem} image={icon} />
          {React.Children.map(children, (el: React.ReactElement<any>) => {
            if (typeof el === 'string') {
              const element = <Title selected={selected}>{el}</Title>;
              return React.cloneElement(element);
            }
            return null;
          })}
        </StyledItem>
        {React.Children.map(children, (el: React.ReactElement<any>) => {
          if (typeof el !== 'string') {
            return React.cloneElement(el, { subItem: true, visible: selected });
          }
          return null;
        })}
      </React.Fragment>
    );
  }
}
