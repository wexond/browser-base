import * as React from 'react';

import store from '@bookmarks/store';
import TreeBarItem from '../TreeBarItem';
import { ForwardIcon, Root } from './styles';

export default class TreeBar extends React.Component {
  public render() {
    return (
      <Root>
        <TreeBarItem home />
        {store.path.map((data: any, key: any) => (
          <React.Fragment key={key}>
            <ForwardIcon className="FORWARD-ICON" />
            <TreeBarItem item={data} />
          </React.Fragment>
        ))}
      </Root>
    );
  }
}
