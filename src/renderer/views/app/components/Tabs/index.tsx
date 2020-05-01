import * as React from 'react';
import { observer } from 'mobx-react-lite';

import Tab from '../Tab';
import store from '../../store';

export const Tabs = observer(() => {
  return (
    <React.Fragment>
      {store.tabs.list.map((item) => (
        <Tab key={item.id} tab={item} />
      ))}
    </React.Fragment>
  );
});
