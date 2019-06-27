import * as React from 'react';
import { observer } from 'mobx-react';
import { BrowserAction } from '../../models';
import { StyledBrowserAction, Badge } from './style';
import ToolbarButton from '../ToolbarButton';
import { ipcRenderer } from 'electron';
import store from '../../store';

interface Props {
  data: BrowserAction;
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

const Component = observer(({ data, size, style, opacity }: Props) => {
  const { icon, badgeText, badgeBackgroundColor, badgeTextColor, tabId } = data;

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
});

(Component as any).defaultProps = {
  size: 16,
  opacity: 1,
};

export default Component;
