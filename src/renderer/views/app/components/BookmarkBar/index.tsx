import { ipcRenderer } from 'electron';
import * as React from 'react';
import store from '../../store';
import { observer } from 'mobx-react-lite';
import {
  BookmarkButton,
  BookmarkBar as StyledBookmarkBar,
  BookmarkSection,
  Favicon,
  Title,
} from './style';
import { ToolbarButton } from '../ToolbarButton';
import {
  ICON_FOLDER,
  ICON_PAGE,
  ICON_ARROW_RIGHT,
} from '~/renderer/constants/icons';
import { IBookmark } from '~/interfaces';

type BookmarkProps = {
  title: string;
  url: string;
  favicon?: string;
  isFolder: boolean;
  id: string;
};

const Bookmark = observer(
  ({ title, url, favicon, isFolder, id }: BookmarkProps) => {
    const { buttonWidth } = store.bookmarksBar;

    function onClick(event: any) {
      if (url) {
        ipcRenderer.send(`add-tab-${store.windowId}`, {
          url,
          active: true,
        });
      } else {
        store.bookmarksBar.showFolderDropdown(event, id);
      }
    }

    function onContextMenu(event: any) {
      store.bookmarksBar.createContextMenu(event, id);
    }
    return (
      <BookmarkButton
        dense
        width={buttonWidth}
        theme={store.theme}
        toggled={false}
        disabled={false}
        onClick={onClick}
        onContextMenu={onContextMenu}
      >
        <Favicon
          style={{
            backgroundImage: `url(${
              favicon || (isFolder ? ICON_FOLDER : ICON_PAGE)
            })`,
            filter:
              store.theme['pages.lightForeground'] && !favicon
                ? 'invert(100%)'
                : 'none',
          }}
        />
        <Title>{title}</Title>
      </BookmarkButton>
    );
  },
);

export const BookmarkBar = observer(() => {
  const { bookmarkBarItems: list, showOverflow } = store.bookmarksBar;

  return store.settings.object.bookmarksBar ? (
    <StyledBookmarkBar>
      <BookmarkSection>
        {list.map(({ title, url, favicon, _id, isFolder }: IBookmark) => (
          <Bookmark
            key={_id}
            id={_id}
            title={title}
            url={url}
            favicon={favicon}
            isFolder={isFolder}
          />
        ))}
      </BookmarkSection>
      {store.bookmarksBar.overflowItems.length > 0 && (
        <ToolbarButton icon={ICON_ARROW_RIGHT} onClick={showOverflow} />
      )}
    </StyledBookmarkBar>
  ) : null;
});
