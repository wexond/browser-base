import * as React from 'react';
import { observer } from 'mobx-react';
import { observe } from 'mobx';

import { TabGroup } from '~/renderer/app/models';
import store from '~/renderer/app/store';
import Tab from '../Tab';
import { TAB_ANIMATION_DURATION } from '~/renderer/app/constants';
import { StyledTabGroup } from './style';

@observer
export default class extends React.Component<{ tabGroup: TabGroup }> {
  public componentDidMount() {
    observe(this.props.tabGroup.tabs, (change: any) => {
      if (change.addedCount > 0 && change.removedCount === 0) {
        if (store.tabsStore.scrollbarRef) {
          store.tabsStore.scrollbarRef.current.scrollToEnd(
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
