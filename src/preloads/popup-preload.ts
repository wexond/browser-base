import { ipcRenderer } from 'electron';

const updateBounds = () => {
  ipcRenderer.sendToHost(
    'webview-size',
    document.body.offsetWidth,
    document.body.offsetHeight,
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

window.addEventListener('blur', () => {
  ipcRenderer.sendToHost('webview-blur');
});
