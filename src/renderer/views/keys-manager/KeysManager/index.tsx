import { observer } from 'mobx-react';
import React from 'react';

import { PageContent, PageContainer } from '../../app/Menu/styles';

@observer
export default class KeysManager extends React.Component {
  public render() {
    return (
      <PageContent>
        <PageContainer>Keys manager</PageContainer>
      </PageContent>
    );
  }
}
