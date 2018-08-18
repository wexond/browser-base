import { observer } from 'mobx-react';
import React from 'react';
import { HistoryItem } from '~/interfaces';
import store from '@app/store';
import { PageItem, Icon, Time, Title } from '../../../components/PageItem';
import { RemoveIcon } from './styles';
import { icons, transparency } from '~/defaults';

interface Props {
  data: HistoryItem;
}

@observer
export default class extends React.Component<Props> {
  public onClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { data } = this.props;
    const { selectedItems } = store.historyStore;

    if (store.cmdPressed || e.ctrlKey) {
      if (selectedItems.indexOf(data._id) === -1) {
        selectedItems.push(data._id);
      } else {
        selectedItems.splice(selectedItems.indexOf(data._id), 1);
      }
    } else {
      store.tabsStore.addTab({ url: data.url });
      store.menuStore.hide();
    }
  };

  public onMouseEnter = () => (this.props.data.hovered = true);

  public onMouseLeave = () => (this.props.data.hovered = false);

  public onRemoveClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const { data } = this.props;

    e.stopPropagation();
    store.historyStore.removeItem(data._id);
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

    return (
      <PageItem
        onClick={this.onClick}
        onFocus={() => null}
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        selected={store.historyStore.selectedItems.indexOf(data._id) !== -1}
      >
        <RemoveIcon onClick={this.onRemoveClick} visible={hovered} />
        <Icon icon={favicon} style={{ opacity: hovered ? 0 : opacity }} />
        <Time>{`${hour
          .toString()
          .padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}</Time>
        <Title>{data.title}</Title>
      </PageItem>
    );
  }
}
