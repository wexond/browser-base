import * as React from 'react';
import { observer } from 'mobx-react';
import store from '../../store';
import { Content, Section } from '../Overlay/style';
import HistoryItem from '../HistoryItem';

const preventHiding = (e: any) => {
  e.stopPropagation();
};

export const History = observer(() => {
  console.log(store.historyStore.historySections);
  return (
    <Content
      right
      visible={
        store.overlayStore.currentContent !== 'default' &&
        store.overlayStore.visible
      }
    >
      <Section
        style={{ padding: 0, paddingTop: 16 + 56 + 16, marginTop: 56 }}
        onClick={preventHiding}
      >
        {store.historyStore.historyItems.slice(0, 1).map(item => (
          <HistoryItem key={item._id} data={item} />
        ))}
      </Section>
      <Section style={{ padding: 0, marginTop: 56 }} onClick={preventHiding}>
        {store.historyStore.historyItems.slice(1, 30).map(item => (
          <HistoryItem key={item._id} data={item} />
        ))}
      </Section>
    </Content>
  );
});
