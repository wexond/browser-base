import * as React from 'react';
import { observer } from 'mobx-react';
import { StyledBrowserAction, Badge } from './style';
import ToolbarButton from '../ToolbarButton';
import { IBrowserAction } from '../../../models';

interface Props {
  data: IBrowserAction;
  size?: number;
  style?: any;
  opacity?: number;
}

const onClick = (tabId: number) => () => {
  if (tabId) {
    /*
    TODO:
    ipcRenderer.send(
      'send-to-all-extensions',
      'api-emit-event-browserAction-onClicked',
      store.tabs.getTabById(tabId).getApiTab(),
    );*/
  }
};

export const BrowserAction = observer(
  ({ data, size, style, opacity }: Props) => {
    const {
      icon,
      badgeText,
      badgeBackgroundColor,
      badgeTextColor,
      tabId,
    } = data;

    return (
      <StyledBrowserAction style={style} onClick={onClick(tabId)}>
        <ToolbarButton opacity={opacity} size={size} icon={icon} />
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
  opacity: 1,
};
