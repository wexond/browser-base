import React from 'react';
import { observer } from 'mobx-react';

import ToolbarButton from '@app/components/ToolbarButton';
import BookmarksDialog from '@app/components/BookmarksDialog';
import store from '@app/store';
import { Bookmark } from '@/interfaces';
import { icons } from '@/constants/renderer';

@observer
export default class BookmarkButton extends React.Component {
  public onStarIconMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  public onStarIconClick = async () => {
    const selectedTab = store.tabsStore.getSelectedTab();

    let bookmark: Bookmark = store.bookmarksStore.bookmarks.find(
      x => x.url === selectedTab.url,
    );

    if (!bookmark) {
      bookmark = await store.bookmarksStore.addBookmark({
        title: selectedTab.title,
        url: selectedTab.url,
        parent: null,
        type: 'item',
        favicon: selectedTab.favicon,
      });
    }

    store.bookmarksStore.dialogRef.show(bookmark);
  };

  public render() {
    return (
      <div style={{ position: 'relative' }}>
        <ToolbarButton
          size={20}
          icon={store.tabsStore.isBookmarked ? icons.star : icons.starBorder}
          onMouseDown={this.onStarIconMouseDown}
          onClick={this.onStarIconClick}
        />
        <BookmarksDialog ref={r => (store.bookmarksStore.dialogRef = r)} />
      </div>
    );
  }
}
