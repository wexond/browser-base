import { observer } from 'mobx-react';
import React from 'react';

import store from '@history/store';
import { PageItem, Icon, Time, Title } from '@/components/PageItem';
import { icons, transparency } from '@/constants/renderer';
import { HistoryItem } from '@/interfaces';
import { RemoveIcon } from './styles';

interface Props {
  data: HistoryItem;
}

@observer
export default class extends React.Component<Props> {
  public onMouseEnter = () => {
    this.props.data.hovered = true;
  };

  public onMouseLeave = () => {
    this.props.data.hovered = false;
  };

  public onClick = (e: React.MouseEvent<any>) => {
    if (store.cmdPressed || e.ctrlKey) {
      e.preventDefault();

      const { data } = this.props;
      const index = store.selectedItems.indexOf(data._id);

      if (index === -1) {
        store.selectedItems.push(data._id);
      } else {
        store.selectedItems.splice(index, 1);
      }
    }
  };

  public onRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    const { data } = this.props;
    store.removeItem(data._id);
  };

  public render() {
    const { data } = this.props;
    const { hovered } = data;

    const date = new Date(data.date);

    const hour = date.getHours();
    const minute = date.getMinutes();

    let opacity = 1;
    let favicon = data.favicon;

    if (favicon == null) {
      favicon = icons.page;
      opacity = transparency.light.inactiveIcon;
    }

    const selected = store.selectedItems.indexOf(data._id) !== -1;

    return (
      <PageItem
        onFocus={() => null}
        onClick={this.onClick}
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        selected={selected}
      >
        <RemoveIcon onClick={this.onRemoveClick} visible={hovered} />
        <Icon icon={favicon} style={{ opacity: hovered ? 0 : opacity }} />

        <Time>{`${hour
          .toString()
          .padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}</Time>
        <a href={data.url}>
          <Title>{data.title}</Title>
        </a>
      </PageItem>
    );
  }
}
