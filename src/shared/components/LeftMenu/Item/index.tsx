import React from 'react';
import { StyledItem, Icon, Title, Indicator } from './styles';

interface Props {
  icon: string;
  children: any;
  subItem?: boolean;
  selected?: boolean;
  visible?: boolean;
  fullWidth?: boolean;
}

export default class Item extends React.Component<Props, {}> {
  static defaultProps = {
    visible: true,
    selected: false,
  };

  public render() {
    const {
      icon, children, subItem, visible, fullWidth,
    } = this.props;

    let { selected } = this.props;

    if (subItem) selected = false;

    return (
      <React.Fragment>
        <StyledItem visible={visible} selected={selected} fullWidth={fullWidth}>
          <Indicator visible={selected} fullWidth={fullWidth} />
          <Icon selected={selected} subItem={subItem} image={icon} fullWidth={fullWidth} />
          {React.Children.map(children, (el: React.ReactElement<any>) => {
            if (typeof el === 'string') {
              return React.cloneElement(<Title selected={selected} fullWidth={fullWidth}>
                  {el}
                                        </Title>);
            }
            return null;
          })}
        </StyledItem>
        {React.Children.map(children, (el: React.ReactElement<any>) => {
          if (typeof el !== 'string') {
            return React.cloneElement(el, { subItem: true, visible: selected, fullWidth });
          }
          return null;
        })}
      </React.Fragment>
    );
  }
}
