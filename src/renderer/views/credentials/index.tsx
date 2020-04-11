import { ipcRenderer } from 'electron';

ipcRenderer.setMaxListeners(0);

import { App } from './components/App';
import { renderUI } from '~/utils/ui-entry';
renderUI(App);
