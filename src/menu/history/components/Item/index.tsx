import { observer } from 'mobx-react';
import React from 'react';
import {
  Icon, StyledItem, Time, Title, RemoveIcon,
} from './styles';
import HistoryItem from '../../models/history-item';
import transparency from '../../../../shared/defaults/opacity';
import Store from '../../store';
import { deleteHistoryItem } from '../../utils';

const pageIcon = require('../../../../shared/icons/page.svg');

interface Props {
  data: HistoryItem;
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

  public onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { data } = this.props;
    const { selected } = data;
    if (this.cmdPressed || e.ctrlKey) {
      data.selected = !selected;

      if (data.selected) {
        Store.selectedItems.push(data);
      } else {
        Store.selectedItems.splice(Store.selectedItems.indexOf(data), 1);
      }
    }
  };

  public onMouseEnter = () => this.setState({ hovered: true });

  public onMouseLeave = () => this.setState({ hovered: false });

  public onRemoveClick = () => {
    const { data } = this.props;
    const { id } = data;
    deleteHistoryItem(id);
  };

  public render() {
    const { data } = this.props;
    const { hovered } = this.state;

    const date = new Date(data.date);

    const hour = date.getHours();
    const minute = date.getMinutes();

    let opacity = 1;
    let favicon = data.favicon;

    if (favicon == null) {
      favicon = pageIcon;
      opacity = transparency.light.inactiveIcon;
    }

    return (
      <StyledItem
        onClick={this.onClick}
        onFocus={() => null}
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        selected={data.selected}
      >
        <RemoveIcon onClick={this.onRemoveClick} visible={hovered} />
        <Icon style={{ backgroundImage: `url(${favicon})`, opacity: hovered ? 0 : opacity }} />
        <Time>{`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}</Time>
        <Title>{data.title}</Title>
      </StyledItem>
    );
  }
}
