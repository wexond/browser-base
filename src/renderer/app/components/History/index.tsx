import * as React from 'react';
import { observer } from 'mobx-react';

import store from '../../store';
import {
  Container,
  Scrollable,
  Content,
  Toolbar,
  ToolbarContent,
  Back,
} from '../Overlay/style';
import HistorySection from '../HistorySection';

const onBackClick = () => {
  store.overlayStore.scrollRef.current.scrollTop = 0;
  store.historyStore.resetLoadedItems();
  store.overlayStore.currentContent = 'default';
};

const preventHiding = (e: any) => {
  e.stopPropagation();
};

export const History = observer(() => {
  return (
    <Container
      right
      visible={
        store.overlayStore.currentContent !== 'default' &&
        store.overlayStore.visible
      }
    >
      <Toolbar onClick={preventHiding}>
        <ToolbarContent>
          <Back onClick={onBackClick} />
          History
        </ToolbarContent>
      </Toolbar>
      <Scrollable>
        <Content>
          {store.historyStore.historySections.map((data, key) => (
            <HistorySection data={data} key={key} />
          ))}
        </Content>
      </Scrollable>
    </Container>
  );
});
