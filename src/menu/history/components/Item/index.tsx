import { observer } from 'mobx-react';
import React from 'react';
import {
  Icon, StyledItem, Time, Title,
} from './styles';
import HistoryItem from '../../models/history-item';
import transparency from '../../../../shared/defaults/opacity';
import Store from '../../store';

const pageIcon = require('../../../../shared/icons/page.svg');

interface Props {
  data: HistoryItem;
}

@observer
export default class Item extends React.Component<Props, {}> {
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

  public render() {
    const { data } = this.props;
    const date = new Date(data.date);

    const hour = date.getHours();
    const minute = date.getMinutes();

    let opacity = 1;

    if (data.favicon == null) {
      data.favicon = pageIcon;
      opacity = transparency.light.inactiveIcon;
    }

    return (
      <StyledItem onClick={this.onClick} selected={data.selected}>
        <Icon style={{ backgroundImage: `url(${data.favicon})`, opacity }} />
        <Time>{`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}</Time>
        <Title>{data.title}</Title>
      </StyledItem>
    );
  }
}
