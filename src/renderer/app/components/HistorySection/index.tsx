import { observer } from 'mobx-react';
import React from 'react';
import { Section } from '../../../../interfaces';
import Item from '../Item';
import { Items, Title } from './styles';

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
