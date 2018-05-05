import { observer } from 'mobx-react';
import { Checkbox } from 'nersent-ui';
import React from 'react';
import { Icon, StyledItem, Time, Title } from './styles';

interface Props {
  data: HistoryItem;
}

@observer
export default class Item extends React.Component<Props, {}> {
  public render() {
    const { data } = this.props;
    const time = data.date;

    return (
      <StyledItem>
        <Checkbox style={{ marginLeft: 16 }} />
        <Time>{time}</Time>
        <Icon />
        <Title>{data.title}</Title>
      </StyledItem>
    );
  }
}
