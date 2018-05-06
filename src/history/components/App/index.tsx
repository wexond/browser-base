import { observer } from 'mobx-react';
import { Checkbox } from 'nersent-ui';
import { hot } from 'react-hot-loader';
import React from 'react';
import { Content, Title } from './styles';
import PageLayout from '../../../shared/components/PageLayout';
import SearchInput from '../../../shared/components/SearchInput';

@observer
class App extends React.Component {
  public render() {
    const checkboxStyle = {
      marginLeft: 16,
    };

    const timeStyle = {
      marginLeft: 16,
    };

    const primaryStyle = {
      marginLeft: 16,
    };

    return (
      <PageLayout title="History">
        <Content />
      </PageLayout>
    );
  }
}

export default hot(module)(App);
