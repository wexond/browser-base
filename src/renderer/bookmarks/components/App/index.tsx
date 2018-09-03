import React from 'react';
import { observer } from 'mobx-react';

import NavigationDrawer from '@/components/NavigationDrawer';
import { icons } from '@/constants/renderer';
import { StyledApp, PageContainer, Content } from './styles';

declare const global: any;

@observer
export default class App extends React.Component {
  public render() {
    return (
      <StyledApp>
        <NavigationDrawer title="Bookmarks" search>
          <NavigationDrawer.Item title="Select all" icon={icons.selectAll} />
          <NavigationDrawer.Item title="Delete all" icon={icons.delete} />
        </NavigationDrawer>
        <PageContainer>Bookmarks</PageContainer>
      </StyledApp>
    );
  }
}
