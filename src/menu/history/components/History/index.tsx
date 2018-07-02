import { observer } from 'mobx-react';
import React from 'react';
import { Content } from './styles';
import { getHistorySections } from '../../utils';
import Store from '../../store';
import AppStore from '../../../../app/store';
import Section from '../Section';
import db from '../../../../shared/models/app-database';

@observer
export default class History extends React.Component {
  public async componentDidMount() {
    db.favicons
      .each(favicon => {
        if (AppStore.favicons[favicon.url] == null && favicon.favicon.byteLength !== 0) {
          AppStore.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
        }
      })
      .then(async () => {
        const sections = await getHistorySections();

        setTimeout(() => {
          Store.sections = sections;
        }, 100);
      });

    Store.selectedItems = [];
  }

  public componentWillUnmount() {
    Store.sections = [];
    Store.loadedItems = 0;
  }

  public onMenuSearchInput = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    const sections = await getHistorySections(e.currentTarget.value);
    Store.sections = sections;
  };

  public render() {
    return (
      <Content>
        {Store.sections.map(section => <Section key={section.id} section={section} />)}
      </Content>
    );
  }
}
