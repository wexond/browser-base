import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { Preloader } from '~/renderer/components/Preloader';
import {
  StyledTab,
  StyledContent,
  StyledIcon,
  StyledTitle,
  StyledClose,
  TabContainer,
} from './style';
import { ITab } from '../../models';
import store from '../../store';
import { remote, ipcRenderer } from 'electron';
import { ICON_MUTE } from '~/renderer/constants/icons';

const removeTab = (tab: ITab) => (e: React.MouseEvent) => {
  e.stopPropagation();
  tab.close();
};

const onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

const onMouseDown = (tab: ITab) => (e: React.MouseEvent<HTMLDivElement>) => {
  const { pageX, button } = e;

  if (store.addressbarEditing) {
    store.inputRef.current.focus();
  }

  if (button === 0) {
    if (!tab.isSelected) {
      tab.select();
    }

    store.tabs.lastMouseX = 0;
    store.tabs.isDragging = true;
    store.tabs.mouseStartX = pageX;
    store.tabs.tabStartX = tab.left;

    store.tabs.lastScrollLeft = store.tabs.containerRef.current.scrollLeft;
  }

  ipcRenderer.send(`hide-tab-preview-${store.windowId}`);
};

const onMouseEnter = (tab: ITab) => (e: React.MouseEvent<HTMLDivElement>) => {
  if (!store.tabs.isDragging) {
    store.tabs.hoveredTabId = tab.id;
  }

  const x = tab.ref.current.getBoundingClientRect().left + 8;

  if (store.tabs.canShowPreview && !store.tabs.isDragging) {
    ipcRenderer.send(`show-tab-preview-${store.windowId}`, {
      id: tab.id,
      x,
    });
  }
};

const onMouseLeave = () => {
  store.tabs.hoveredTabId = -1;
};

const onClick = (tab: ITab) => (e: React.MouseEvent<HTMLDivElement>) => {
  if (e.button === 4) {
    tab.close();
  }
};

const onMouseUp = (tab: ITab) => (e: React.MouseEvent<HTMLDivElement>) => {
  if (e.button === 1) {
    tab.close();
  }
};

const onContextMenu = (tab: ITab) => () => {
  const menu = remote.Menu.buildFromTemplate([
    {
      label: 'New tab to the right',
      click: () => {
        store.tabs.addTab(
          {
            index: store.tabs.list.indexOf(store.tabs.selectedTab) + 1,
          },
          tab.tabGroupId,
        );
      },
    },
    {
      label: 'Add to a new group',
      click: () => {
        const tabGroup = store.tabGroups.addGroup();
        tab.tabGroupId = tabGroup.id;
        store.tabs.updateTabsBounds(true);
      },
    },
    {
      label: 'Remove from group',
      visible: !!tab.tabGroup,
      click: () => {
        tab.removeFromGroup();
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: () => {
        tab.callViewMethod('webContents.reload');
      },
    },
    {
      label: 'Duplicate',
      click: () => {
        store.tabs.addTab({ active: true, url: tab.url });
      },
    },
    {
      label: tab.isPinned ? 'Unpin tab' : 'Pin tab',
      click: () => {
        tab.isPinned ? store.tabs.unpinTab(tab) : store.tabs.pinTab(tab);
      },
    },
    {
      label: tab.isMuted ? 'Unmute tab' : 'Mute tab',
      click: () => {
        tab.isMuted ? store.tabs.unmuteTab(tab) : store.tabs.muteTab(tab);
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Close tab',
      accelerator: 'CmdOrCtrl+W',
      click: () => {
        tab.close();
      },
    },
    {
      label: 'Close other tabs',
      click: () => {
        for (const t of store.tabs.list) {
          if (t !== tab) {
            t.close();
          }
        }
      },
    },
    {
      label: 'Close tabs to the left',
      click: () => {
        for (let i = store.tabs.list.indexOf(tab) - 1; i >= 0; i--) {
          store.tabs.list[i].close();
        }
      },
    },
    {
      label: 'Close tabs to the right',
      click: () => {
        for (
          let i = store.tabs.list.length - 1;
          i > store.tabs.list.indexOf(tab);
          i--
        ) {
          store.tabs.list[i].close();
        }
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Revert closed tab',
      enabled: store.tabs.closedUrl !== '',
      click: () => {
        store.tabs.revertClosed();
      },
    },
  ]);

  menu.popup();
};

const Content = observer(({ tab }: { tab: ITab }) => {
  return (
    <StyledContent collapsed={tab.isExpanded} pinned={tab.isPinned}>
      {!tab.loading && tab.favicon !== '' && (
        <StyledIcon
          isIconSet={tab.favicon !== ''}
          style={{ backgroundImage: `url(${tab.favicon})` }}
        ></StyledIcon>
      )}

      {tab.loading && (
        <Preloader
          color={store.theme.accentColor}
          thickness={6}
          size={16}
          indeterminate
          style={{ minWidth: 16 }}
        />
      )}
      {!tab.isPinned && (
        <StyledTitle isIcon={tab.isIconSet} selected={tab.isSelected}>
          {tab.title}
        </StyledTitle>
      )}
    </StyledContent>
  );
});

const Close = observer(({ tab }: { tab: ITab }) => {
  return (
    <StyledClose
      onMouseDown={onCloseMouseDown}
      onClick={removeTab(tab)}
      visible={tab.isExpanded && !tab.isPinned}
    />
  );
});

export default observer(({ tab }: { tab: ITab }) => {
  const defaultColor = store.theme['toolbar.lightForeground']
    ? 'rgba(255, 255, 255, 0.04)'
    : 'rgba(255, 255, 255, 0.3)';

  const defaultHoverColor = store.theme['toolbar.lightForeground']
    ? 'rgba(255, 255, 255, 0.08)'
    : 'rgba(255, 255, 255, 0.5)';

  return (
    <StyledTab
      selected={tab.isSelected}
      onMouseDown={onMouseDown(tab)}
      onMouseUp={onMouseUp(tab)}
      onMouseEnter={onMouseEnter(tab)}
      onContextMenu={onContextMenu(tab)}
      onClick={onClick(tab)}
      onMouseLeave={onMouseLeave}
      ref={tab.ref}
    >
      <TabContainer
        pinned={tab.isPinned}
        style={{
          backgroundColor: tab.isSelected
            ? store.theme['toolbar.backgroundColor']
            : tab.isHovered
            ? defaultHoverColor
            : defaultColor,
        }}
      >
        <Content tab={tab} />
        {tab.isMuted && !tab.loading && !tab.isPinned && (
          <StyledIcon
            isIconSet={tab.isMuted}
            style={{
              backgroundImage: `url(${ICON_MUTE})`,
              position: 'absolute',
              right: 32,
              zIndex: 9999,
              filter: store.theme['toolbar.lightForeground']
                ? 'invert(100%)'
                : 'none',
              opacity: 0.54,
            }}
          />
        )}
        <Close tab={tab} />
      </TabContainer>
    </StyledTab>
  );
});
