import { observer } from 'mobx-React';
import React from 'react';
import { getHistoryItems, getHistorySections } from '../../../../utils';
import store from '../../../store';
import Section from '../Section';
import { Container, Content } from './styles';

@observer
export default class History extends React.Component {
  public render() {
    const sections = getHistorySections(getHistoryItems(store.menu.searchText));

    return (
      <Content>
        <Container>
          {sections.map(section => (
            <Section key={section.id} section={section} />
          ))}
        </Container>
      </Content>
    );
  }
}
