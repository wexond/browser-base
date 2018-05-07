import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import { Content } from './styles';
import PageLayout from '../../../shared/components/PageLayout';

@observer
class App extends React.Component {
  public render() {
    return (
      <PageLayout title="History">
        <Content />
      </PageLayout>
    );
  }
}

export default hot(module)(App);
