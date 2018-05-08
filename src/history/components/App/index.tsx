import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import { Content } from './styles';
import PageLayout from '../../../shared/components/PageLayout';
import { getSections } from '../../utils/history';
import Store from '../../store';
import Section from '../Section';

declare const wexond: any;

@observer
class App extends React.Component {
  public async componentDidMount() {
    const history = await wexond.getHistory();
    const sections = getSections(history);

    Store.sections = sections;
  }

  public render() {
    return (
      <PageLayout title="History">
        <Content>
          {Store.sections
            .slice(0, 2)
            .map(section => <Section key={section.id} section={section} />)}
        </Content>
      </PageLayout>
    );
  }
}

export default hot(module)(App);
