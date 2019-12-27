import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ToolbarButton } from '../ToolbarButton';
import { IBrowserAction } from '../../../models';
import { extensionsRenderer } from 'electron-extensions/renderer';
import { ipcRenderer } from 'electron';
import store from '../../../store';
import { format } from 'url';

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
    left + width / 2,
    format({
      protocol: 'electron-extension',
      slashes: true,
      hostname: data.extensionId,
      pathname: data.popup,
    }),
  );
};

export const BrowserAction = observer(({ data }: Props) => {
  const {
    icon,
    badgeText,
    badgeBackgroundColor,
    badgeTextColor,
    tabId,
    extensionId,
  } = data;

  return (
    <ToolbarButton
      onClick={onClick(data)}
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
