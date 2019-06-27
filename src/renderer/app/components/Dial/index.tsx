import * as React from 'react';
import { observer } from 'mobx-react';
import store from '../../store';
import { icons } from '../../constants';
import { ContextMenu, ContextMenuItem } from '../ContextMenu';
import { DropArrow, Title } from '../Overlay/style';
import { BookmarksDial } from '../BookmarksDial';
import { TopSites } from '../TopSites';

const changeDialType = (type: 'top-sites' | 'bookmarks') => () => {
  store.settings.dialType = type;
  store.saveSettings();
};

const onDialTitleClick = (e: any) => {
  e.stopPropagation();
  store.overlay.dialTypeMenuVisible = !store.overlay.dialTypeMenuVisible;
};

export const Dial = observer(() => {
  const { dialType } = store.settings;

  return (
    <>
      {(store.history.topSites.length > 0 ||
        store.bookmarks.list.length > 0) && (
        <>
          <Title
            onClick={onDialTitleClick}
            style={{ marginBottom: 24, cursor: 'pointer' }}
          >
            {dialType === 'bookmarks' ? 'Bookmarks' : 'Top Sites'}
            <DropArrow />
            <ContextMenu
              style={{ top: 42 }}
              visible={store.overlay.dialTypeMenuVisible}
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
          </Title>
          {dialType === 'bookmarks' ? <BookmarksDial /> : <TopSites />}
        </>
      )}
    </>
  );
});
