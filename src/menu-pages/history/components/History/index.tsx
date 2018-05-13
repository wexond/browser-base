import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import { Content } from './styles';
import { getSections } from '../../utils/history';
import Store from '../../store';
import AppStore from '../../../../app/store';
import Section from '../Section';
import { getHistory, favicons } from '../../../../app/utils/storage';
import { Favicon } from '../../../../shared/models/favicon';

@observer
class History extends React.Component {
  public async componentDidMount() {
    const history = await getHistory();

    favicons.all('SELECT * FROM favicons', (err: any, faviconItems: Favicon[]) => {
      if (err) throw err;
      for (const favicon of faviconItems) {
        if (AppStore.favicons[favicon.url] == null) {
          AppStore.favicons[favicon.url] = window.URL.createObjectURL(new Blob([favicon.favicon]));
        }
      }

      const sections = getSections(history.reverse());

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
