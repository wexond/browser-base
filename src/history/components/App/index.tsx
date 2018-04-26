import React from 'react';
import { observer } from 'mobx-react';

import PageLayout from '../../../shared/components/PageLayout';

@observer
export default class App extends React.Component {
  public render() {
    return <PageLayout title="History" />;
  }
}
