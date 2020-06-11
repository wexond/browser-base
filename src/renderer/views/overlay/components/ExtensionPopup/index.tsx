import * as React from 'react';

import { observer } from 'mobx-react-lite';
import { StyledExtensionPopup } from './style';
import store from '../../store';

let loaded = false;

export const ExtensionPopup = observer(() => {
  const info = store.popups.get('extensionPopup');

  const [size, setSize] = React.useState({ width: 1, height: 1 });
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
        setSize({ width: e.args[0], height: e.args[1] });
        setVisible(true);
        info.left = info.x - e.args[0];
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
      [info.left, info.top, size.width, size.height],
    ]);
  }

  return (
    <StyledExtensionPopup
      style={{
        left: info.left,
        top: info.top,
        width: size.width,
        height: size.height,
      }}
      hideTransition={false}
      visible={visible}
    >
      <webview
        ref={(r: Electron.WebviewTag) => (store.webviewRef = r)}
        style={{
          width: '100%',
          height: '100%',
        }}
        src={store.extensionUrl}
      ></webview>
    </StyledExtensionPopup>
  );
});
