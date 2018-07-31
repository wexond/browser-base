import { observer } from 'mobx-react';
import React from 'react';
import { Content, Container } from './styles';
import store from '../../../store';
import { getHistoryItems, getHistorySections } from '../../../utils/history';
import Section from '../Section';

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
