import React from 'react';
import { observer } from 'mobx-react';

import Section from '../Section';
import NavigationDrawer from '@components/NavigationDrawer';
import store from '@history/store';
import { icons } from '~/renderer/defaults';
import { StyledApp, PageContainer, Content } from './styles';

declare const global: any;

@observer
export default class App extends React.Component {
  componentDidMount() {
    global.onIpcReceived.addListener((name: string, data: any) => {
      if (name === 'history') {
        store.historyItems = Object.values(data);
        store.loadSections();
      } else if (name === 'dictionary') {
        store.dictionary = data;
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
        <PageContainer>
          <Content>
            {store.historySections.map(section => (
              <Section key={section.id} section={section} />
            ))}
          </Content>
        </PageContainer>
      </StyledApp>
    );
  }
}
