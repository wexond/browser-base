import React from 'react';
import { observer } from 'mobx-react';
import { observe } from 'mobx';

import { TabGroup } from '@/models/app';
import store from '@app/store';
import Tab from '../Tab';
import { TAB_ANIMATION_DURATION } from '@/constants/app';
import { StyledTabGroup } from './styles';

@observer
export default class extends React.Component<{ tabGroup: TabGroup }> {
  public componentDidMount() {
    observe(this.props.tabGroup.tabs, (change: any) => {
      if (change.addedCount > 0 && change.removedCount === 0) {
        if (store.tabsStore.scrollbarRef) {
          store.tabsStore.scrollbarRef.scrollToEnd(
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
