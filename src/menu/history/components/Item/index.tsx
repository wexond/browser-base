import { observer } from 'mobx-react';
import React from 'react';

import transparency from '../../../../shared/defaults/opacity';
import Store from '../../store';
import AppStore from '../../../../app/store';
import { deleteHistoryItem } from '../../utils';

import {
  PageItem,
  PageItemIcon,
  PageItemTime,
  PageItemTitle,
} from '../../../../shared/components/PageItem';
import { RemoveIcon } from './styles';
import HistoryItem from '../../../../shared/models/history-item';

const pageIcon = require('../../../../shared/icons/page.svg');

@observer
export default class Item extends React.Component<{ data: HistoryItem }, { hovered: boolean }> {
  public state = {
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

    if (this.cmdPressed || e.ctrlKey) {
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
      <PageItem
        onClick={this.onClick}
        onFocus={() => null}
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        selected={Store.selectedItems.indexOf(data.id) !== -1}
      >
        <RemoveIcon onClick={this.onRemoveClick} visible={hovered} />
        <PageItemIcon icon={favicon} style={{ opacity: hovered ? 0 : opacity }} />
        <PageItemTime>
          {`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}
        </PageItemTime>
        <PageItemTitle>{data.title}</PageItemTitle>
      </PageItem>
    );
  }
}
