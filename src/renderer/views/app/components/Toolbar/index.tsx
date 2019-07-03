import { observer } from 'mobx-react';
import * as React from 'react';
import { ipcRenderer } from 'electron';

import store from '../../store';
import { Buttons, StyledToolbar, Handle } from './style';
import { NavigationButtons } from './NavigationButtons';
import { Tabbar } from './Tabbar';
import ToolbarButton from './ToolbarButton';
import { icons } from '~/renderer/constants';
import { Separator } from '../Overlay/style';
import { BrowserAction } from './BrowserAction';

const onUpdateClick = () => {
  ipcRenderer.send('update-install');
};

@observer
class BrowserActions extends React.Component {
  public render() {
    const { selectedTabId } = store.tabGroups.currentGroup;

    return (
      <>
        {selectedTabId &&
          store.extensions.browserActions.map(item => {
            if (item.tabId === selectedTabId) {
              return <BrowserAction data={item} key={item.extensionId} />;
            }
            return null;
          })}
      </>
    );
  }
}

export const Toolbar = observer(() => {
  const { selectedTab } = store.tabs;

  let isWindow = false;
  let blockedAds: any = '';

  if (selectedTab) {
    isWindow = selectedTab.isWindow;
    blockedAds = selectedTab.blockedAds;
  }

  return (
    <StyledToolbar
      overlayType={store.overlay.currentContent}
      isHTMLFullscreen={store.isHTMLFullscreen}
    >
      <Handle />
      <div style={{ flex: 1, display: 'flex' }}>
        <div
          style={{ flex: 1, display: store.tabbarVisible ? 'flex' : 'none' }}
        >
          <NavigationButtons />
          <Tabbar />
        </div>
      </div>
      <Buttons>
        <BrowserActions />
        {store.updateInfo.available && (
          <ToolbarButton icon={icons.download} onClick={onUpdateClick} />
        )}
        {store.extensions.browserActions.length > 0 && <Separator />}
        {!isWindow && (
          <BrowserAction
            size={18}
            style={{ marginLeft: 0 }}
            opacity={0.54}
            data={{
              badgeBackgroundColor: 'gray',
              badgeText: blockedAds > 0 ? blockedAds.toString() : '',
              icon: icons.shield,
              badgeTextColor: 'white',
            }}
          />
        )}
      </Buttons>
    </StyledToolbar>
  );
});
