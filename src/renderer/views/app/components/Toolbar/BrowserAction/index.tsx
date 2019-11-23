import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { ToolbarButton } from '../ToolbarButton';
import { IBrowserAction } from '../../../models';
import { extensionsRenderer } from 'electron-extensions/renderer';

interface Props {
  data: IBrowserAction;
}

const onClick = (extensionId: string, tabId: number) => () => {
  if (tabId) {
    extensionsRenderer.browserAction.onClicked(extensionId, tabId);
  }
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
      onClick={onClick(extensionId, tabId)}
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
