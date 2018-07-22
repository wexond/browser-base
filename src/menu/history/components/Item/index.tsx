import { observer } from 'mobx-react';
import React from 'react';
import transparency from '../../../../shared/defaults/opacity';
import Store from '../../store';
import AppStore from '../../../../app/store';
import { deleteHistoryItem } from '../../utils';
import HistoryItem from '../../../../shared/models/history-item';
import {
  Root, Icon, Time, Title, RemoveIcon,
} from '../../../../shared/components/PageItem';

const pageIcon = require('../../../../shared/icons/page.svg');

@observer
export default class Item extends React.Component<{ data: HistoryItem }, { hovered: boolean }> {
  public state = {
    hovered: false,
  };

  public onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { data } = this.props;

    if (Store.cmdPressed || e.ctrlKey) {
      if (Store.selectedItems.indexOf(data.id) === -1) {
        Store.selectedItems.push(data.id);
      } else {
        Store.selectedItems.splice(Store.selectedItems.indexOf(data.id), 1);
      }
    } else {
      AppStore.getCurrentWorkspace().addTab(data.url);
      AppStore.menu.hide();
    }
  };

  public onMouseEnter = () => this.setState({ hovered: true });

  public onMouseLeave = () => this.setState({ hovered: false });

  public onRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

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
      <Root
        onClick={this.onClick}
        onFocus={() => null}
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        selected={Store.selectedItems.indexOf(data.id) !== -1}
      >
        <RemoveIcon onClick={this.onRemoveClick} visible={hovered} />
        <Icon icon={favicon} style={{ opacity: hovered ? 0 : opacity }} />
        <Time>{`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}</Time>
        <Title>{data.title}</Title>
      </Root>
    );
  }
}
