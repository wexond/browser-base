import { observer } from 'mobx-react';
import React from 'react';

import store from '@history/store';
import { PageItem, Icon, Time, Title } from '@/components/PageItem';
import { icons, transparency } from '@/constants/renderer';
import { HistoryItem } from '@/interfaces';
import { HistorySection } from '@/interfaces/history';
import { RemoveIcon } from './styles';

interface Props {
  data: HistoryItem;
  section: HistorySection;
}

declare const global: any;

@observer
export default class extends React.Component<Props> {
  public onMouseEnter = () => {
    this.props.data.hovered = true;
  };

  public onMouseLeave = () => {
    this.props.data.hovered = false;
  };

  public onRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const { data, section } = this.props;

    global.historyAPI.delete(data._id);
    section.items = section.items.filter(x => x._id !== data._id);

    if (section.items.length === 0) {
      const index = store.historySections.indexOf(section);
      store.historySections.splice(index, 1);
    }
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

    // console.log(store.selectedItems);

    return (
      <PageItem
        onFocus={() => null}
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
