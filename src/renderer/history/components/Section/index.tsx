import { observer } from 'mobx-react';
import React from 'react';

import { HistorySection } from '@/interfaces/history';
import Item from '../Item';
import { Items, Title } from './styles';

@observer
export default class extends React.Component<{ section: HistorySection }, {}> {
  public render() {
    const { section } = this.props;
    const { items, title } = section;

    return (
      <React.Fragment>
        <Title>{title}</Title>
        <Items>
          {items.map(item => (
            <Item key={item._id} data={item} section={section} />
          ))}
        </Items>
      </React.Fragment>
    );
  }
}
