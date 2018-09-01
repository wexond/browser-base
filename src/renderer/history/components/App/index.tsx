import React from 'react';
import { observer } from 'mobx-react';

import Section from '../Section';
import NavigationDrawer from '@components/NavigationDrawer';
import store from '@history/store';
import { icons } from '~/renderer/defaults';
import { StyledApp, PageContainer, Content } from './styles';
import Preloader from '@components/Preloader';

declare const global: any;

@observer
export default class App extends React.Component {
  componentDidMount() {
    global.onIpcReceived.addListener((name: string, data: any) => {
      if (name === 'history') {
        store.historyItems = Object.values(data);
        store.loadSections();
        store.loading = false;
      } else if (name === 'dictionary') {
        store.dictionary = data;
      }
    });
  }

  public onScroll = (e: any) => {
    console.log(e);
  };

  public render() {
    let i = -1;

    return (
      <StyledApp>
        <NavigationDrawer title="History" search>
          <NavigationDrawer.Item title="Select all" icon={icons.selectAll} />
          <NavigationDrawer.Item title="Delete all" icon={icons.delete} />
        </NavigationDrawer>
        <PageContainer>
          {(!store.loading && (
            <Content onScroll={this.onScroll}>
              {store.historySections.map(section => {
                i++;
                if (i < store.sectionsCount) {
                  return <Section key={section.id} section={section} />;
                }
                return null;
              })}
            </Content>
          )) || (
            <Preloader
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          )}
        </PageContainer>
      </StyledApp>
    );
  }
}
