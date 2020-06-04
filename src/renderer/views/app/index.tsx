import App from './components/App';
import { renderUI } from '~/utils/ui-entry';
renderUI(App);

const resizeObserver = new ResizeObserver(() => {
  browser.ipcRenderer.send('resize-height');
});
const app = document.getElementById('app');
resizeObserver.observe(app);
