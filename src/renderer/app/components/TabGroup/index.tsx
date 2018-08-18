import React from 'react';
import { observer } from 'mobx-react';

import { TabGroup } from '../../models';
import store from '@app/store';
import { StyledTabGroup } from './styles';
import Tab from '../Tab';

@observer
export default class extends React.Component<{ tabGroup: TabGroup }> {
  public render() {
    const { tabGroup } = this.props;

    return (
      <StyledTabGroup visible={tabGroup.id === store.tabsStore.currentGroup}>
        {tabGroup.tabs.map(tab => (
          <Tab key={tab.id} tab={tab} />
        ))}
      </StyledTabGroup>
    );
  }
}
