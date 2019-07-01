import * as React from 'react';
import { observer } from 'mobx-react';

import { BookmarksDial } from '../BookmarksDial';
import { TopSites } from '../TopSites';
import store from '~/renderer/views/app/store';
import { ContextMenu, ContextMenuItem } from '../../../components/ContextMenu';
import { icons } from '~/renderer/constants';
import { Container, DropArrow, DialTitle } from './style';
import { preventHiding } from '../../..';

const changeDialType = (type: 'top-sites' | 'bookmarks') => () => {
  store.settings.object.dialType = type;
  store.settings.save();
};

const onDialTitleClick = (e: any) => {
  e.stopPropagation();
  store.overlay.dialTypeMenuVisible = !store.overlay.dialTypeMenuVisible;
};

export const Dial = observer(() => {
  const { dialType } = store.settings.object;

  return (
    <>
      {(store.history.topSites.length > 0 ||
        store.bookmarks.list.length > 0) && (
        <>
          <Container>
            <DialTitle
              onClick={onDialTitleClick}
              style={{ marginBottom: 24, cursor: 'pointer' }}
            >
              {dialType === 'bookmarks' ? 'Bookmarks' : 'Top Sites'}
              <DropArrow />
            </DialTitle>
            <ContextMenu
              style={{ top: 42, marginLeft: 24 }}
              visible={store.overlay.dialTypeMenuVisible}
              onClick={preventHiding}
            >
              <ContextMenuItem
                icon={icons.fire}
                selected={dialType === 'top-sites'}
                onClick={changeDialType('top-sites')}
              >
                Top Sites
              </ContextMenuItem>
              <ContextMenuItem
                icon={icons.bookmarks}
                selected={dialType === 'bookmarks'}
                onClick={changeDialType('bookmarks')}
              >
                Bookmarks
              </ContextMenuItem>
            </ContextMenu>
          </Container>

          {dialType === 'bookmarks' ? <BookmarksDial /> : <TopSites />}
        </>
      )}
    </>
  );
});
