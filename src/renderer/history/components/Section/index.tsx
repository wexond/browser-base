import { observer } from 'mobx-react';
import React from 'react';

import Item from '../Item';
import { HistorySection } from '~/interfaces';
import { Items, Title } from './styles';

@observer
export default class extends React.Component<{ section: HistorySection }, {}> {
  public render() {
    const { section } = this.props;
    const { items, date } = section;

    const title = date;

    return (
      <React.Fragment>
        <Title>{title}</Title>
        <Items>
          {items.map(item => (
            <Item key={item._id} data={item} />
          ))}
        </Items>
      </React.Fragment>
    );
  }
}
