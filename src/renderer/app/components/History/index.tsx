import * as React from 'react';
import { observer } from 'mobx-react';
import store from '../../store';
import { Content, Section } from '../Overlay/style';
import HistoryItem from '../HistoryItem';

const preventHiding = (e: any) => {
  e.stopPropagation();
};

export const History = observer(() => {
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
        {store.historyStore.historyItems.slice(0, 30).map(item => (
          <HistoryItem data={item} />
        ))}
      </Section>
    </Content>
  );
});
