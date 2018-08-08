import React from 'react';
import { observer } from 'mobx-react';

import store from '../../../store';
import Section from '../Section';
import { getHistorySections, getHistoryItems } from '../../../../utils';
import { PageContent, PageContainer } from '../../app/Menu/styles';

@observer
export default class History extends React.Component {
  public render() {
    const sections = getHistorySections(getHistoryItems(store.menu.searchText));

    return (
      <PageContent>
        <PageContainer>
          {sections.map(section => (
            <Section key={section.id} section={section} />
          ))}
        </PageContainer>
      </PageContent>
    );
  }
}
