import React from 'react';
import { observer } from 'mobx-react';

import { TabGroup } from '../../models';
import store from '@app/store';
import { StyledTabGroup } from './styles';
import Tab from '../Tab';
import { observe } from 'mobx';
import { TAB_ANIMATION_DURATION } from '~/constants';

@observer
export default class extends React.Component<{ tabGroup: TabGroup }> {
  public componentDidMount() {
    observe(this.props.tabGroup.tabs, (change: any) => {
      if (change.addedCount > 0 && change.removedCount === 0) {
        if (store.tabbarStore.scrollbarRef) {
          store.tabbarStore.scrollbarRef.scrollToEnd(
            TAB_ANIMATION_DURATION * 1000,
          );
        }
      }
    });
  }

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
