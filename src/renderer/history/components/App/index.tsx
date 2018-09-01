import React from 'react';
import { observer } from 'mobx-react';

import NavigationDrawer from '@components/NavigationDrawer';
import store from '@history/store';
import { icons } from '~/renderer/defaults';
import { HistoryItem } from '~/interfaces';
import { StyledApp, PageContainer } from './styles';

declare const global: any;

@observer
export default class App extends React.Component {
  componentDidMount() {
    // store.loadHistory();

    global.onIpcReceived.addListener((name: string, items: HistoryItem[]) => {
      if (name === 'history') {
        console.log(items);
      }
    });
  }

  public render() {
    return (
      <StyledApp>
        <NavigationDrawer title="History" search>
          <NavigationDrawer.Item title="Select all" icon={icons.selectAll} />
          <NavigationDrawer.Item title="Delete all" icon={icons.delete} />
        </NavigationDrawer>
        <PageContainer>Content</PageContainer>
      </StyledApp>
    );
  }
}
