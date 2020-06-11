import { ipcRenderer } from 'electron';

const updateBounds = () => {
  const { width, height } = document.body.getBoundingClientRect();
  ipcRenderer.sendToHost(
    `size`,
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
  ipcRenderer.sendToHost('blur');
};

window.addEventListener('focus', () => {
  console.log('focus');
});

window.addEventListener('blur', close);

window.close = close;
