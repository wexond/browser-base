import { ipcRenderer } from 'electron';

const updateBounds = () => {
  const { width, height } = document.body.getBoundingClientRect();
  ipcRenderer.send(
    `extension-popup-size`,
    width === 0 ? 1 : width,
    height === 0 ? 1 : height,
  );
};

window.addEventListener('load', () => {
  updateBounds();

  // @ts-ignore
  const resizeObserver = new ResizeObserver(() => {
    updateBounds();
  });

  resizeObserver.observe(document.body);
});

const close = () => {
  ipcRenderer.send('webview-blur');
};

window.addEventListener('blur', close);

window.close = close;
