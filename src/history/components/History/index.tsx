import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import { Content } from './styles';
import { getSections } from '../../utils/history';
import Store from '../../store';
import Section from '../Section';
import { getHistory } from '../../../app/utils/storage';
import HistoryItem from '../../models/history-item';

@observer
class History extends React.Component {
  public async componentDidMount() {
    getHistory().then(history => {
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
