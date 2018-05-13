import { observer } from 'mobx-react';
import React from 'react';
import { Icon, StyledItem, Time, Title } from './styles';
import HistoryItem from '../../../shared/models/history-item';
import transparency from '../../../shared/defaults/opacity';

const pageIcon = require('../../../shared/icons/page.svg');

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

    let opacity = 1;

    if (data.favicon == null) {
      data.favicon = pageIcon;
      opacity = transparency.light.inactiveIcon;
    }

    return (
      <StyledItem>
        <Icon style={{ backgroundImage: `url(${data.favicon})`, opacity }} />
        <Time>{`${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`}</Time>
        <Title>{data.title}</Title>
      </StyledItem>
    );
  }
}
