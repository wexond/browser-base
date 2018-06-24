import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import { Content, Toolbar } from './styles';
import { getSections } from '../../utils';
import Store from '../../store';
import AppStore from '../../../../app/store';
import Section from '../Section';
import { Favicon } from '../../../../shared/models/favicon';
import db from '../../../../shared/models/app-database';

@observer
class History extends React.Component {
  public async componentDidMount() {
    db.favicons
      .each(favicon => {
        if (AppStore.favicons[favicon.url] == null && favicon.favicon.byteLength !== 0) {
          AppStore.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
        }
      })
      .then(() => {
        const sections = getSections();
        setTimeout(() => {
          Store.sections = sections;
        }, 250);
      });
  }

  public componentWillUnmount() {
    Store.sections = [];
  }

  public render() {
    return (
      <React.Fragment>
        <Content>
          {Store.sections.map(section => <Section key={section.id} section={section} />)}
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(History);
