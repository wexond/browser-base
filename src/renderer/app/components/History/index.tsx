import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import { Content } from '../Overlay/style';
import HistorySection from '../HistorySection';

export const History = observer(() => {
  return (
    <Content
      right
      visible={
        store.overlayStore.currentContent !== 'default' &&
        store.overlayStore.visible
      }
    >
      {store.historyStore.historySections.map((data, key) => (
        <HistorySection data={data} key={key} />
      ))}
    </Content>
  );
});
