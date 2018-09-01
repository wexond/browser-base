import React from 'react';
import { observer } from 'mobx-react';

import store from '@history/store';
import Section from '../Section';
import { StyledApp, PageContainer } from './styles';

@observer
export default class App extends React.Component {
  componentDidMount() {
    store.loadHistory();
  }

  public render() {
    return (
      <StyledApp>
        <PageContainer>
          {store.historySections.map(section => (
            <Section key={section.id} section={section} />
          ))}
        </PageContainer>
      </StyledApp>
    );
  }
}
