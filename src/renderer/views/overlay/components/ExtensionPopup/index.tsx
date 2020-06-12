import * as React from 'react';

import { observer } from 'mobx-react-lite';
import { StyledExtensionPopup } from './style';
import store from '../../store';

let loaded = false;

export const ExtensionPopup = observer(() => {
  const info = store.popups.get('extensionPopup');

  const [visible, setVisible] = React.useState(false);

  if (!info.visible && visible) {
    setVisible(false);
    store.extensionUrl = 'about:blank';
    store.webviewRef.blur();
  }

  React.useEffect(() => {
    if (loaded) return;
    loaded = true;

    store.webviewRef.addEventListener('ipc-message', (e) => {
      if (e.channel === 'size' && store.extensionUrl !== 'about:blank') {
        info.width = e.args[0];
        info.height = e.args[1];

        store.webviewRef.style.width = info.width + 'px';
        store.webviewRef.style.height = info.height + 'px';

        setVisible(true);

        info.left = info.x - info.width;
        info.top = info.y;

        store.webviewRef.focus();
      } else if (e.channel === 'blur') {
        browser.overlayPrivate.updatePopup('extensionPopup', {
          visible: false,
        });
      }
    });
  });

  if (visible) {
    browser.overlayPrivate.setRegions([
      [info.left, info.top, info.width, info.height],
    ]);
  }

  return (
    <StyledExtensionPopup
      style={{
        left: info.left || 0,
        top: info.top || 0,
      }}
      hideTransition={false}
      visible={visible}
    >
      <webview
        ref={(r: Electron.WebviewTag) => (store.webviewRef = r)}
        src={store.extensionUrl}
      ></webview>
    </StyledExtensionPopup>
  );
});
