import React from 'react';
import { observer } from 'mobx-react';
import store from '@app/store';
import { PageContent, PageContainer } from '../Menu/styles';
import HistorySection from '../HistorySection';

@observer
export default class History extends React.Component {
  public render() {
    const { historyStore } = store;
    const sections = historyStore.getSections(
      historyStore.getItems(store.menuStore.searchText),
    );

    return (
      <PageContent>
        <PageContainer>
          {sections.map(section => (
            <HistorySection key={section.id} section={section} />
          ))}
        </PageContainer>
      </PageContent>
    );
  }
}
