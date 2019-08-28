import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { Preloader } from '~/renderer/components/Preloader';
import {
  StyledTab,
  StyledContent,
  StyledIcon,
  StyledTitle,
  StyledClose,
  StyledBorder,
  StyledOverlay,
  TabContainer,
} from './style';
import { shadeBlendConvert } from '~/utils';
import Ripple from '~/renderer/components/Ripple';
import { ITab } from '../../../models';
import store from '../../../store';
import { remote } from 'electron';
import { icons } from '~/renderer/constants';

const removeTab = (tab: ITab) => (e: React.MouseEvent) => {
  e.stopPropagation();
  tab.close();
};

const onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

const onMouseDown = (tab: ITab) => (e: React.MouseEvent<HTMLDivElement>) => {
  const { pageX, button } = e;

  if (button !== 0) return;

  if (!tab.isSelected) {
    tab.select();
  } else {
    store.canToggleMenu = true;
  }

  store.tabs.lastMouseX = 0;
  store.tabs.isDragging = true;
  store.tabs.mouseStartX = pageX;
  store.tabs.tabStartX = tab.left;

  store.tabs.lastScrollLeft = store.tabs.containerRef.current.scrollLeft;
};

const onMouseEnter = (tab: ITab) => () => {
  if (!store.tabs.isDragging) {
    store.tabs.hoveredTabId = tab.id;
  }
};

const onMouseLeave = () => {
  store.tabs.hoveredTabId = -1;
};

const onClick = (tab: ITab) => (e: React.MouseEvent<HTMLDivElement>) => {
  if (store.canToggleMenu && !tab.isWindow) {
    if (!store.overlay.isNewTab) {
      store.overlay.visible = !store.overlay.visible;
    }

    store.canToggleMenu = false;
  }

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
  const { tabs } = store.tabGroups.currentGroup;

  const menu = remote.Menu.buildFromTemplate([
    {
      label: 'New tab',
      click: () => {
        store.tabs.onNewTab();
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Reload',
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
      click: () => {
        tab.close();
      },
    },
    {
      label: 'Close other tabs',
      click: () => {
        for (const t of tabs) {
          if (t !== tab) {
            t.close();
          }
        }
      },
    },
    {
      label: 'Close tabs from left',
      click: () => {
        for (let i = tabs.indexOf(tab) - 1; i >= 0; i--) {
          tabs[i].close();
        }
      },
    },
    {
      label: 'Close tabs from right',
      click: () => {
        for (let i = tabs.length - 1; i > tabs.indexOf(tab); i--) {
          tabs[i].close();
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
          color={tab.background}
          thickness={6}
          size={16}
          style={{ minWidth: 16 }}
        />
      )}
      {!tab.isPinned && (
        <StyledTitle
          isIcon={tab.isIconSet}
          style={{
            color: tab.isSelected
              ? store.theme['tab.selected.textColor'] === 'inherit'
                ? tab.background
                : store.theme['tab.selected.textColor']
              : store.theme['tab.textColor'],
          }}
        >
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

const Border = observer(({ tab }: { tab: ITab }) => {
  return <StyledBorder visible={tab.borderVisible} />;
});

const Overlay = observer(({ tab }: { tab: ITab }) => {
  return (
    <StyledOverlay
      hovered={tab.isHovered}
      style={{
        backgroundColor: tab.isSelected
          ? shadeBlendConvert(
              store.theme['tab.selectedHover.backgroundOpacity'],
              tab.background,
              store.overlay.currentContent !== 'default'
                ? store.theme['toolbar.overlay.backgroundColor']
                : store.theme['toolbar.backgroundColor'],
            )
          : store.theme['tab.hover.backgroundColor'],
      }}
    />
  );
});

export default observer(({ tab }: { tab: ITab }) => {
  return (
    <StyledTab
      selected={tab.isSelected}
      onMouseDown={onMouseDown(tab)}
      onMouseUp={onMouseUp(tab)}
      onMouseEnter={onMouseEnter(tab)}
      onContextMenu={onContextMenu(tab)}
      onClick={onClick(tab)}
      onMouseLeave={onMouseLeave}
      visible={tab.tabGroupId === store.tabGroups.currentGroupId}
      ref={tab.ref}
      title={tab.title}
    >
      <TabContainer
        pinned={tab.isPinned}
        style={{
          backgroundColor: tab.isSelected
            ? shadeBlendConvert(
                store.theme['tab.backgroundOpacity'],
                tab.background,
                store.overlay.currentContent !== 'default'
                  ? store.theme['toolbar.overlay.backgroundColor']
                  : store.theme['toolbar.backgroundColor'],
              )
            : 'transparent',
        }}
      >
        <Content tab={tab} />
        {tab.isMuted && !tab.loading && !tab.isPinned && (
          <StyledIcon
            isIconSet={tab.isMuted}
            style={{
              backgroundImage: `url(${icons.mute})`,
              position: 'absolute',
              right: 32,
              zIndex: 9999,
              filter: store.theme['toolbar.icons.invert']
                ? 'invert(100%)'
                : 'none',
              opacity: 0.54,
            }}
          />
        )}
        <Close tab={tab} />

        <Overlay tab={tab} />
        <Ripple
          rippleTime={0.6}
          opacity={0.15}
          color={tab.background}
          style={{ zIndex: 9 }}
        />
      </TabContainer>
      <Border tab={tab} />
    </StyledTab>
  );
});
