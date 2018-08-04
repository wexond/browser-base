import { observer } from 'mobx-react';
import React from 'react';

import store from '../../../store';
import {
  Root, RemoveIcon, Icon, Time, Title,
} from '../../../components/PageItem';
import { HistoryItem } from '../../../../interfaces';
import { deleteHistoryItem } from '../../../../utils';
import { icons, opacity } from '../../../../defaults';

@observer
export default class Item extends React.Component<{ data: HistoryItem }, { hovered: boolean }> {
  public state = {
    hovered: false,
  };

  public onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { data } = this.props;

    if (store.cmdPressed || e.ctrlKey) {
      if (store.selectedHistoryItems.indexOf(data.id) === -1) {
        store.selectedHistoryItems.push(data.id);
      } else {
        store.selectedHistoryItems.splice(store.selectedHistoryItems.indexOf(data.id), 1);
      }
    } else {
      store.getCurrentWorkspace().addTab({ url: data.url });
      store.menu.hide();
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

    let transparency = 1;
    let favicon = data.favicon;

    if (favicon == null) {
      favicon = icons.page;
      transparency = opacity.light.inactiveIcon;
    }

    return (
      <Root
        onClick={this.onClick}
        onFocus={() => null}
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        selected={store.selectedHistoryItems.indexOf(data.id) !== -1}
      >
        <RemoveIcon onClick={this.onRemoveClick} visible={hovered} />
        <Icon icon={favicon} style={{ opacity: hovered ? 0 : transparency }} />
        <Time>{`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}</Time>
        <Title>{data.title}</Title>
      </Root>
    );
  }
}
