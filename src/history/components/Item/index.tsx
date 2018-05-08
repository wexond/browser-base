import { observer } from 'mobx-react';
import { Checkbox } from 'nersent-ui';
import React from 'react';
import { Icon, StyledItem, Time, Title } from './styles';
import HistoryItem from '../../models/history-item';

interface Props {
  data: HistoryItem;
}

@observer
export default class Item extends React.Component<Props, {}> {
  public render() {
    const { data } = this.props;
    const date = new Date(data.date);

    const hour = date.getHours();
    const minute = date.getMinutes();

    return (
      <StyledItem>
        <Checkbox style={{ marginLeft: 16 }} />
        <Time>{`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}</Time>
        <Icon />
        <Title>{data.title}</Title>
      </StyledItem>
    );
  }
}
