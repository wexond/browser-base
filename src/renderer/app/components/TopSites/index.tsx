import * as React from 'react';
import { observer } from 'mobx-react';
import store from '../../store';
import { MenuItem } from '../MenuItem';
import { Menu } from '../Overlay/style';
import { callBrowserViewMethod } from '~/shared/utils/browser-view';

const onSiteClick = (url: string) => () => {
  const tab = store.tabs.selectedTab;

  if (!tab || store.overlay.isNewTab) {
    store.tabs.addTab({ url, active: true });
  } else {
    tab.url = url;
    callBrowserViewMethod('webContents.loadURL', tab.id, url);
  }

  store.overlay.visible = false;
};

const getSize = (i: number) => {
  const width = 800;
  return (width - 48 - (i - 1)) / i;
};

export default observer(() => {
  return (
    <Menu>
      {store.history.topSites.map(item => (
        <MenuItem
          width={getSize(6)}
          onClick={onSiteClick(item.url)}
          key={item._id}
          maxLines={1}
          iconSize={20}
          light
          icon={store.favicons.favicons[item.favicon]}
        >
          {item.title}
        </MenuItem>
      ))}
    </Menu>
  );
});
