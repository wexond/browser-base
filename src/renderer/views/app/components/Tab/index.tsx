import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { Preloader } from '~/renderer/components/Preloader';
import {
  StyledTab,
  StyledContent,
  StyledIcon,
  StyledTitle,
  StyledClose,
  StyledAction,
  StyledPinAction,
  TabContainer,
} from './style';
import { ICON_VOLUME_HIGH, ICON_VOLUME_OFF } from '~/renderer/constants';
import { ITab, ITabGroup } from '../../models';
import store from '../../store';
import { remote, ipcRenderer, nativeImage, Menu } from 'electron';
import { COMPACT_TAB_MARGIN_TOP } from '~/constants/design';

const removeTab = (tab: ITab) => (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
  tab.close();
};

const toggleMuteTab = (tab: ITab) => (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
  tab.isMuted ? store.tabs.unmuteTab(tab) : store.tabs.muteTab(tab);
};

const onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

const onVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

const onMouseDown = (tab: ITab) => (e: React.MouseEvent<HTMLDivElement>) => {
  const { pageX, button } = e;

  if (store.addressbarEditing) {
    store.inputRef.focus();
  }

  if (button === 0) {
    if (!tab.isSelected) {
      tab.select();
    } else {
      store.canOpenSearch = true;
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

  const { bottom, left } = tab.ref.current.getBoundingClientRect();

  const x = left + 8;
  const y = store.isCompact ? bottom - COMPACT_TAB_MARGIN_TOP : bottom;

  if (store.tabs.canShowPreview && !store.tabs.isDragging) {
    ipcRenderer.send(`show-tab-preview-${store.windowId}`, {
      id: tab.id,
      x,
      y,
    });
  }
};

const onMouseLeave = () => {
  store.tabs.hoveredTabId = -1;
  ipcRenderer.send(`hide-tab-preview-${store.windowId}`);
  store.tabs.canShowPreview = true;
};

const onClick = (tab: ITab) => (e: React.MouseEvent<HTMLDivElement>) => {
  if (e.button === 4) {
    tab.close();
    return;
  }

  if (store.isCompact && e.button === 0 && store.canOpenSearch) {
    store.inputRef.focus();
    store.canOpenSearch = false;
  }
};

const onMouseUp = (tab: ITab) => (e: React.MouseEvent<HTMLDivElement>) => {
  if (e.button === 1) {
    tab.close();
  }
};

const onContextMenu = (tab: ITab) => () => {
  const tabGroups: ITabGroup[] = store.tabGroups
    .getGroups()
    .filter((t) => t.id !== tab.tabGroupId);

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
      visible: tabGroups.length === 0,
      click: () => {
        addTabToNewGroup(tab);
      },
    },
    {
      label: 'Add tab to group',
      visible: tabGroups.length > 0,
      submenu: tabGroupSubmenu(tab, tabGroups),
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

const addTabToNewGroup = (tab: ITab): void => {
  tab.removeFromGroup();
  const tabGroup = store.tabGroups.addGroup();
  tab.tabGroupId = tabGroup.id;
  store.tabs.updateTabsBounds(true);
};

const tabGroupSubmenu = (tab: ITab, tabGroups: ITabGroup[]): Menu => {
  return remote.Menu.buildFromTemplate([
    {
      label: 'New group',
      click: () => {
        addTabToNewGroup(tab);
      },
    },
    {
      type: 'separator',
    },
    ...tabGroups.map((tabGroup) => ({
      label: tabGroupLabel(tabGroup),
      icon: tabGroupIcon(tabGroup.color),
      click: () => {
        store.tabs.setTabToGroup(tab, tabGroup.id);
      },
    })),
  ]);
};

const tabGroupLabel = (tabGroup: ITabGroup): string => {
  const tabs = store.tabs.list.filter((x) => x.tabGroupId === tabGroup.id);
  const tabsLength = tabs.length;
  const tabTitle = tabs[0].title;

  let label =
    tabGroup.name ||
    `"${tabTitle.substr(0, 20)}${tabTitle.length > 20 ? '... ' : ''}"`;

  if (!tabGroup.name && tabsLength > 1) {
    label += ` and ${tabsLength - 1} other tabs`;
  }
  return label;
};

const tabGroupIcon = (color: string): nativeImage => {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  canvas.width = canvas.height = 12;

  context.fillStyle = color;
  context.beginPath();
  context.ellipse(
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2,
    canvas.height / 2,
    0,
    0,
    Math.PI * 2,
  );
  context.fill();
  return nativeImage.createFromDataURL(canvas.toDataURL());
};

const Content = observer(({ tab }: { tab: ITab }) => {
  return (
    <StyledContent>
      {!tab.loading && tab.favicon !== '' && (
        <StyledIcon
          isIconSet={tab.favicon !== ''}
          style={{ backgroundImage: `url(${tab.favicon})` }}
        >
          <PinnedVolume tab={tab} />
        </StyledIcon>
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
          {tab.isSelected && store.isCompact ? tab.url : tab.title}
        </StyledTitle>
      )}
      <ExpandedVolume tab={tab} />
      <Close tab={tab} />
    </StyledContent>
  );
});

const ExpandedVolume = observer(({ tab }: { tab: ITab }) => {
  return (
    <StyledAction
      onMouseDown={onVolumeMouseDown}
      onClick={toggleMuteTab(tab)}
      visible={tab.isExpanded && !tab.isPinned && tab.isPlaying}
      icon={tab.isMuted ? ICON_VOLUME_OFF : ICON_VOLUME_HIGH}
    />
  );
});

const PinnedVolume = observer(({ tab }: { tab: ITab }) => {
  return (
    <StyledPinAction
      onMouseDown={onVolumeMouseDown}
      onClick={toggleMuteTab(tab)}
      visible={tab.isPinned && tab.isPlaying}
      icon={tab.isMuted ? ICON_VOLUME_OFF : ICON_VOLUME_HIGH}
    />
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

  const defaultSelectedHoverColor = store.theme['toolbar.lightForeground']
    ? '#393939'
    : '#fcfcfc';

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
        hasTabGroup={tab.tabGroupId !== -1}
        pinned={tab.isPinned}
        selected={tab.isSelected}
        style={{
          backgroundColor: tab.isSelected
            ? store.isCompact && tab.isHovered
              ? defaultSelectedHoverColor
              : store.theme['toolbar.backgroundColor']
            : tab.isHovered
            ? defaultHoverColor
            : defaultColor,
          borderColor:
            tab.isSelected && tab.tabGroupId !== -1 && !store.isCompact
              ? tab.tabGroup?.color
              : 'transparent',
        }}
      >
        <Content tab={tab} />
      </TabContainer>
    </StyledTab>
  );
});
