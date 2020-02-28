import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Title, SubTitle, Back } from './style';

import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from '~/renderer/components/ContextMenu';
import { Switch } from '~/renderer/components/Switch';
import { Dropdown } from '~/renderer/components/Dropdown';

import store from '../../store';
import { icons } from '~/renderer/constants';

const onBackClick = () => {
  store.preferencesContent = 'main';
};

const onCustomClick = () => {
  store.preferencesContent = 'custom';
};

export const SwitchItem = observer(
  ({
    children,
    name,
    disabled,
  }: {
    children: any;
    name: string;
    disabled?: boolean;
  }) => {
    return (
      <ContextMenuItem
        disabled={disabled}
        onClick={() => ((store as any)[name] = !(store as any)[name])}
      >
        <div style={{ flex: 1 }}>{children}</div>
        <Switch value={(store as any)[name]}></Switch>
      </ContextMenuItem>
    );
  },
);

export const Preferences = observer(() => {
  return (
    <ContextMenu
      translucent
      style={{ right: 32, top: 68, width: 275 }}
      visible={store.dashboardSettingsVisible}
      onMouseDown={e => e.stopPropagation()}
    >
      <div
        style={{
          display: 'flex',
          overflow: store.overflowVisible ? 'visible' : 'hidden',
          position: 'relative',
          transform: 'translate(0, 0)',
        }}
      >
        <div
          style={{
            opacity: store.preferencesContent === 'main' ? 1 : 0,
            minWidth: 275,
            transition: '0.3s opacity, 0.3s transform',
            top: 0,
            left: 0,
            transform:
              store.preferencesContent === 'main'
                ? 'none'
                : 'translateX(-100%)',
          }}
        >
          <Title style={{ marginLeft: 20 }}>Page layout</Title>

          <ContextMenuSeparator></ContextMenuSeparator>

          <ContextMenuItem iconSize={28} icon={icons.window}>
            Focused
          </ContextMenuItem>
          <ContextMenuItem iconSize={28} icon={icons.window}>
            Inspirational
          </ContextMenuItem>
          <ContextMenuItem iconSize={28} icon={icons.window}>
            Informational
          </ContextMenuItem>
          <ContextMenuItem
            onClick={onCustomClick}
            iconSize={28}
            icon={icons.window}
          >
            Custom
          </ContextMenuItem>
        </div>
        <div
          style={{
            minWidth: 275,
            position: 'relative',
            opacity: store.preferencesContent === 'custom' ? 1 : 0,
            transition: '0.3s max-height, 0.3s transform, 0.3s opacity',
            maxHeight: store.preferencesContent === 'custom' ? 390 : 200,
            transform:
              store.preferencesContent === 'custom'
                ? 'translateX(-100%)'
                : 'none',
          }}
        >
          <Title>
            <Back onClick={onBackClick} icon={icons.back}></Back>
            Custom
          </Title>
          <ContextMenuSeparator></ContextMenuSeparator>
          <SwitchItem name="imageVisible">Show image</SwitchItem>
          <SwitchItem disabled={!store.imageVisible} name="changeImageDaily">
            Change the image daily
          </SwitchItem>
          <ContextMenuItem
            disabled={!store.imageVisible || store.changeImageDaily}
          >
            Choose image...
          </ContextMenuItem>
          <ContextMenuSeparator></ContextMenuSeparator>
          <SwitchItem name="topSitesVisible">Show top sites</SwitchItem>
          <SwitchItem name="quickMenuVisible">Show quick menu</SwitchItem>
          <ContextMenuSeparator></ContextMenuSeparator>
          <SubTitle>News visibility:</SubTitle>
          <Dropdown
            defaultValue="on-scroll"
            onMouseDown={() => (store.overflowVisible = true)}
            style={{ margin: '0 20px 8px' }}
          >
            <Dropdown.Item value="always-visible">Always visible</Dropdown.Item>
            <Dropdown.Item value="hidden">Hidden</Dropdown.Item>
            <Dropdown.Item value="on-scroll">Visible on scroll</Dropdown.Item>
          </Dropdown>
        </div>
      </div>
    </ContextMenu>
  );
});
