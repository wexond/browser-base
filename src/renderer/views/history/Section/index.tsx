import { observer } from 'mobx-react';
import React from 'react';
import { Items, Title } from './styles';
import Item from '../Item';
import Section from '../../../models/section';

@observer
export default class extends React.Component<{ section: Section }, {}> {
  public render() {
    const { section } = this.props;
    const { items, date } = section;

    const title = date;

    return (
      <React.Fragment>
        <Title>{title}</Title>
        <Items>
          {items.map(item => (
            <Item key={item.id} data={item} />
          ))}
        </Items>
      </React.Fragment>
    );
  }
}
