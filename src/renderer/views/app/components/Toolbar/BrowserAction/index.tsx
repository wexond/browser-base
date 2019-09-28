import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { StyledBrowserAction, Badge } from './style';
import { ToolbarButton } from '../ToolbarButton';
import { IBrowserAction } from '../../../models';
import { extensionsRenderer } from 'electron-extensions/renderer';

interface Props {
  data: IBrowserAction;
  size?: number;
  style?: any;
  opacity?: number;
  autoInvert?: boolean;
}

const onClick = (extensionId: string, tabId: number) => () => {
  if (tabId) {
    extensionsRenderer.browserAction.onClicked(extensionId, tabId);
  }
};

export const BrowserAction = observer(
  ({ data, size, style, opacity, autoInvert }: Props) => {
    const {
      icon,
      badgeText,
      badgeBackgroundColor,
      badgeTextColor,
      tabId,
      extensionId,
    } = data;

    return (
      <StyledBrowserAction style={style} onClick={onClick(extensionId, tabId)}>
        <ToolbarButton
          opacity={opacity}
          autoInvert={autoInvert}
          size={size}
          icon={icon}
        />
        {badgeText.trim() !== '' && (
          <Badge background={badgeBackgroundColor} color={badgeTextColor}>
            {badgeText}
          </Badge>
        )}
      </StyledBrowserAction>
    );
  },
);

(BrowserAction as any).defaultProps = {
  size: 16,
  autoInvert: false,
  opacity: 1,
};
