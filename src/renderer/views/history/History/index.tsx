import { observer } from 'mobx-react';
import React from 'react';
import { Content, Container } from './styles';
import { getHistorySections, getHistoryItems } from '../../utils';
import Store from '../../store';
import AppStore from '../../../../app/store';
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
        if (AppStore.favicons[favicon.url] == null && favicon.favicon.byteLength !== 0) {
          AppStore.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
        }
      })
      .then(async () => {
        Store.historyItems = await getHistoryItems('');
        Store.sections = await getHistorySections(Store.historyItems.slice(0, 30));
        Store.allSections = await getHistorySections(Store.historyItems);
        Store.itemsLimit = 50;
      });

    Store.selectedItems = [];

    this.content.addEventListener('scroll', async e => {
      if (this.content.scrollTop === this.content.scrollHeight - this.content.offsetHeight) {
        Store.historyItems = await getHistoryItems(this.inputText);
        Store.sections = await getHistorySections(Store.historyItems.slice(0, Store.itemsLimit));
        Store.itemsLimit += 10;
      }
    });

    window.addEventListener('keydown', e => {
      Store.cmdPressed = e.key === 'Meta'; // Command on macOS
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'Meta') {
        Store.cmdPressed = false;
      }
    });
  }

  public componentWillUnmount() {
    Store.sections = [];
  }

  public onMenuSearchInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const { currentTarget } = e;

    this.inputText = currentTarget.value;

    Store.historyItems = await getHistoryItems(this.inputText);
    Store.sections = await getHistorySections(Store.historyItems.slice(0, 30));
    Store.allSections = await getHistorySections(Store.historyItems);
    Store.itemsLimit = 50;
  };

  public render() {
    return (
      <Content innerRef={r => (this.content = r)}>
        <Container innerRef={r => (this.container = r)}>
          {Store.sections.map(section => <Section key={section.id} section={section} />)}
        </Container>
      </Content>
    );
  }
}
