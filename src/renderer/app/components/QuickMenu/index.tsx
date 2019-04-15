import * as React from 'react';
import { observer } from 'mobx-react';
import { Section, Actions } from '../Overlay/style';
import { preventHiding, Header } from '../Overlay';
import { Bubble } from '../Bubble';
import { icons } from '../../constants';
import store from '../../store';

const changeContent = (content: 'history' | 'default' | 'bookmarks') => () => {
  store.overlay.currentContent = content;
};

const onFindClick = () => {
  store.overlay.visible = false;

  store.tabs.selectedTab.findVisible = true;

  setTimeout(() => {
    store.tabs.selectedTab.findVisible = true;
  }, 200);
};

export const QuickMenu = observer(() => {
  return (
    <Section onClick={preventHiding}>
      <Header>Menu</Header>
      <Actions>
        <Bubble onClick={changeContent('history')} invert icon={icons.history}>
          History
        </Bubble>
        <Bubble
          onClick={changeContent('bookmarks')}
          invert
          icon={icons.bookmarks}
        >
          Bookmarks
        </Bubble>
        <Bubble disabled invert icon={icons.download}>
          Downloads
        </Bubble>
        <Bubble disabled invert icon={icons.settings}>
          Settings
        </Bubble>
        <Bubble disabled invert icon={icons.extensions}>
          Extensions
        </Bubble>
        <Bubble
          disabled={!store.tabs.selectedTab}
          invert
          icon={icons.find}
          onClick={onFindClick}
        >
          Find
        </Bubble>
        <Bubble disabled invert icon={icons.more}>
          More tools
        </Bubble>
      </Actions>
    </Section>
  );
});
