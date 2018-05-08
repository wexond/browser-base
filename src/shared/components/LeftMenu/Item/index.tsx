import React from 'react';
import { StyledItem, Icon, Title, Indicator } from './styles';

interface Props {
  icon: string;
  children: any;
  subItem?: boolean;
  selected?: boolean;
  visible?: boolean;
}

export default class Item extends React.Component<Props, {}> {
  static defaultProps = {
    visible: true,
    selected: false,
  };

  public render() {
    const {
      icon, children, subItem, visible,
    } = this.props;

    let { selected } = this.props;

    if (subItem) selected = false;

    return (
      <React.Fragment>
        <StyledItem visible={visible} selected={selected}>
          <Indicator visible={selected} />
          <Icon selected={selected} subItem={subItem} image={icon} />
          {React.Children.map(children, (el: React.ReactElement<any>) => {
            if (typeof el === 'string') {
              return React.cloneElement(<Title selected={selected}>{el}</Title>);
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
