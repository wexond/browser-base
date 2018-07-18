import { observer } from 'mobx-react';
import React from 'react';
import { Content, Container } from './styles';
import { getHistorySections } from '../../utils';
import Store from '../../store';
import AppStore from '../../../../app/store';
import Section from '../Section';
import db from '../../../../shared/models/app-database';

@observer
export default class History extends React.Component {
  private content: HTMLDivElement;

  private container: HTMLDivElement;

  public async componentDidMount() {
    db.favicons
      .each(favicon => {
        if (AppStore.favicons[favicon.url] == null && favicon.favicon.byteLength !== 0) {
          AppStore.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
        }
      })
      .then(async () => {
        const sections = await getHistorySections(20);

        Store.itemsLimit = 40;

        setTimeout(() => {
          Store.sections = sections;
        }, 100);
      });

    Store.selectedItems = [];

    this.content.addEventListener('scroll', async e => {
      console.log(this.content.scrollTop, this.content.scrollHeight - this.content.offsetHeight);
      if (this.content.scrollTop === this.content.scrollHeight - this.content.offsetHeight) {
        const sections = await getHistorySections(Store.itemsLimit);
        Store.sections = sections;

        Store.itemsLimit += 20;
      }
    });
  }

  public componentWillUnmount() {
    Store.sections = [];
  }

  public onMenuSearchInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const sections = await getHistorySections(20, e.currentTarget.value);
    Store.sections = sections;
    Store.itemsLimit = 40;
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
