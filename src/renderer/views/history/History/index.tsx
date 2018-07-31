import { observer } from 'mobx-react';
import React from 'react';
import { Content, Container } from './styles';
import { getHistorySections, getHistoryItems } from '../../utils';
import store from '../../store';
import Appstore from '../../../../app/store';
import Section from '../Section';
import db from '../../../../shared/models/app-database';
import HistoryItem from '../../../../shared/models/history-item';

@observer
export default class History extends React.Component {
  private content: HTMLDivElement;

  private container: HTMLDivElement;

  private inputText = '';

  public async componentDidMount() {
    db.favicons
      .each(favicon => {
        if (Appstore.favicons[favicon.url] == null && favicon.favicon.byteLength !== 0) {
          Appstore.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
        }
      })
      .then(async () => {
        store.historyItems = await getHistoryItems('');
        store.sections = await getHistorySections(store.historyItems.slice(0, 30));
        store.allSections = await getHistorySections(store.historyItems);
        store.itemsLimit = 50;
      });

    store.selectedItems = [];

    this.content.addEventListener('scroll', async e => {
      if (this.content.scrollTop === this.content.scrollHeight - this.content.offsetHeight) {
        store.historyItems = await getHistoryItems(this.inputText);
        store.sections = await getHistorySections(store.historyItems.slice(0, store.itemsLimit));
        store.itemsLimit += 10;
      }
    });

    window.addEventListener('keydown', e => {
      store.cmdPressed = e.key === 'Meta'; // Command on macOS
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'Meta') {
        store.cmdPressed = false;
      }
    });
  }

  public componentWillUnmount() {
    store.sections = [];
  }

  public onMenuSearchInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { currentTarget } = e;

    this.inputText = currentTarget.value;

    store.historyItems = await getHistoryItems(this.inputText);
    store.sections = await getHistorySections(store.historyItems.slice(0, 30));
    store.allSections = await getHistorySections(store.historyItems);
    store.itemsLimit = 50;
  };

  public render() {
    return (
      <Content innerRef={r => (this.content = r)}>
        <Container innerRef={r => (this.container = r)}>
          {store.sections.map(section => <Section key={section.id} section={section} />)}
        </Container>
      </Content>
    );
  }
}
