import React from 'react';

import TreeBarItem from '../TreeBarItem';
import store from '@app/store';
import { ForwardIcon, Root } from './styles';

export default class TreeBar extends React.Component {
  public render() {
    return (
      <Root>
        <TreeBarItem home />
        {store.bookmarksStore.path.map((data: any, key: any) => (
          <React.Fragment key={key}>
            <ForwardIcon className="FORWARD-ICON" />
            <TreeBarItem item={data} />
          </React.Fragment>
        ))}
      </Root>
    );
  }
}
