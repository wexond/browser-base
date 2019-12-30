import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ToolbarButton } from '../ToolbarButton';
import { IBrowserAction } from '../../../models';
import { extensionsRenderer } from 'electron-extensions/renderer';
import { ipcRenderer, remote } from 'electron';
import store from '../../../store';
import { format } from 'url';
import { EXTENSIONS_PROTOCOL } from '~/constants';

interface Props {
  data: IBrowserAction;
}

const onClick = (data: IBrowserAction) => (
  e: React.MouseEvent<HTMLDivElement>,
) => {
  if (data.tabId) {
    extensionsRenderer.browserAction.onClicked(data.extensionId, data.tabId);
  }

  const { left, width } = e.currentTarget.getBoundingClientRect();
  ipcRenderer.send(
    `show-extension-popup-${store.windowId}`,
    left + width,
    data.popup,
  );
};

const onContextMenu = (data: IBrowserAction) => (
  e: React.MouseEvent<HTMLDivElement>,
) => {
  const { target } = e;
  const menu = remote.Menu.buildFromTemplate([
    {
      label: 'Inspect popup',
      click: () => {
        const { left, width } = target.getBoundingClientRect();

        ipcRenderer.send(
          `inspect-extension-popup-${store.windowId}`,
          left + width / 2,
          format({
            protocol: EXTENSIONS_PROTOCOL,
            slashes: true,
            hostname: data.extensionId,
            pathname: data.popup,
          }),
        );
      },
    },
    {
      label: 'Inspect background page',
      click: () => {
        ipcRenderer.invoke(
          `inspect-extension`,
          store.isIncognito,
          data.extensionId,
        );
      },
    },
  ]);

  menu.popup();
};

const onMouseDown = (data: IBrowserAction) => (e: any) => {
  ipcRenderer.send(`hide-extension-popup-${store.windowId}`);
};

export const BrowserAction = observer(({ data }: Props) => {
  const { icon, badgeText, badgeBackgroundColor, badgeTextColor } = data;

  return (
    <ToolbarButton
      onClick={onClick(data)}
      onMouseDown={onMouseDown(data)}
      onContextMenu={onContextMenu(data)}
      opacity={1}
      autoInvert={false}
      size={16}
      icon={icon}
      badge={badgeText.trim() !== ''}
      badgeBackground={badgeBackgroundColor}
      badgeTextColor={badgeTextColor}
      badgeText={badgeText}
    ></ToolbarButton>
  );
});
