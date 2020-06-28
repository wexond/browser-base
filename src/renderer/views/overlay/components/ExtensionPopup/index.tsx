import * as React from 'react';

import { observer } from 'mobx-react-lite';
import { StyledExtensionPopup } from './style';
import store from '../../store';

let loaded = false;

export const ExtensionPopup = observer(() => {
  const region = store.getRegion('extensionPopup');

  React.useEffect(() => {
    if (loaded) return;
    loaded = true;

    store.webviewRef.addEventListener('ipc-message', (e) => {
      if (
        e.channel === 'size' &&
        store.extensionPopupInfo.url !== 'about:blank'
      ) {
        const { baseX, baseY } = store.extensionPopupInfo;
        const [width, height] = e.args;

        store.updateRegion('extensionPopup', {
          left: baseX - width,
          top: baseY,
          width,
          height,
          visible: true,
        });

        store.webviewRef.style.width = width + 'px';
        store.webviewRef.style.height = height + 'px';

        store.webviewRef.focus();

        store.extensionPopupInfo.visible = true;

        browser.overlayPrivate.setPopupVisible('extensionPopup', true);
      } else if (e.channel === 'blur') {
        store.closeExtensionPopup();
      }
    });
  });

  return (
    <StyledExtensionPopup
      style={{
        left: region.left || 0,
        top: region.top || 0,
      }}
      hideTransition={false}
      visible={store.extensionPopupInfo.visible}
    >
      <webview
        ref={(r: Electron.WebviewTag) => (store.webviewRef = r)}
        src={store.extensionPopupInfo.url}
      ></webview>
    </StyledExtensionPopup>
  );
});
