import { observer } from 'mobx-react';
import React from 'react';

import transparency from '../../../../shared/defaults/opacity';

import { PageItem, PageItemIcon, PageItemRemoveIcon } from '../../../../shared/components/PageItem';

import { Title } from './styles';

const pageIcon = require('../../../../shared/icons/page.svg');

interface Props {
  data: any;
}

interface State {
  hovered: boolean;
}

@observer
export default class Item extends React.Component<Props, State> {
  public state: State = {
    hovered: false,
  };

  private cmdPressed = false;

  public componentDidMount() {
    window.addEventListener('keydown', e => {
      this.cmdPressed = e.key === 'Meta'; // Command on macOS
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'Meta') {
        this.cmdPressed = false;
      }
    });
  }

  public onMouseEnter = () => this.setState({ hovered: true });

  public onMouseLeave = () => this.setState({ hovered: false });

  public render() {
    const { data } = this.props;
    const { hovered } = this.state;

    let opacity = 1;
    let favicon = data.favicon;

    if (favicon == null) {
      favicon = pageIcon;
      opacity = transparency.light.inactiveIcon;
    }

    return (
      <PageItem
        onFocus={() => null}
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        selected={data.selected}
      >
        <PageItemRemoveIcon visible={hovered} />
        <PageItemIcon
          style={{ backgroundImage: `url(${favicon})`, opacity: hovered ? 0 : opacity }}
        />
        <Title>{data.title}</Title>
      </PageItem>
    );
  }
}
