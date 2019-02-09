import * as React from 'react';
import { observer } from 'mobx-react';

import FlipMove from 'react-flip-move';

import store from '~/renderer/app/store';
import Tab from '../Tab';

export const Tabs = observer(() => {
  return (
    <React.Fragment>
      {store.tabsStore.tabs.map(item => (
        <Tab key={item.id} tab={item} />
      ))}
    </React.Fragment>
  );
});
