import { observer } from 'mobx-react';
import { Checkbox } from 'nersent-ui';
import React from 'react';
import { Header, Items, StyledCard, Title } from './styles';
import Item from '../Item';
import HistoryItem from '../../models/history-item';

interface Props {
  title: string;
  items: HistoryItem[];
}

@observer
export default class Card extends React.Component<Props, {}> {
  public render() {
    const { title, items } = this.props;

    return (
      <StyledCard>
        <Header>
          <Checkbox style={{ marginLeft: 16 }} />
          <Title>{title}</Title>
        </Header>
        <Items>{items.map(item => <Item key={item.id} data={item} />)}</Items>
      </StyledCard>
    );
  }
}
