import * as React from 'react';

import { observer } from 'mobx-react-lite';
import { StyledExtensionPopup } from './style';
import store from '../../store';

let loaded = false;

export const ExtensionPopup = observer(() => {
  const info = store.popups.get('extensionPopup');

  const { x, y } = store.extensionBounds;

  const [size, setSize] = React.useState({ width: 1, height: 1 });

  React.useEffect(() => {
    if (loaded) return;
    loaded = true;

    store.webviewRef.addEventListener('ipc-message', (e) => {
      if (e.channel === 'size') {
        setSize({ width: e.args[0], height: e.args[1] });
      }
    });
  });

  return (
    <StyledExtensionPopup
      style={{
        left: x,
        top: y,
        width: size.width,
        height: size.height,
      }}
      hideTransition={false}
      visible={info.visible}
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
