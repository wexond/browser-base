import './styles/index.scss';
import { ipcRenderer } from 'electron';
import { getDomain } from '~/shared/utils/url';

const title = document.getElementById('title');
const permission = document.getElementById('permission');

const deny = document.getElementById('deny');
const allow = document.getElementById('allow');

ipcRenderer.on('request-permission', (e: any, { url, name, details }: any) => {
  const domain = getDomain(url);
  title.textContent = `${domain} wants to:`;

  if (name === 'notifications') {
    permission.textContent = 'Show notifications';
  } else if (name === 'media') {
    if (details.mediaTypes.indexOf('audio') !== -1) {
      permission.textContent = 'Access your microphone';
    } else if (details.mediaTypes.indexOf('audio') !== -1) {
      permission.textContent = 'Access your camera';
    }
  }
});

const sendResult = (r: boolean) => {
  ipcRenderer.send('request-permission-result', r);
};

deny.onclick = () => {
  sendResult(false);
};

allow.onclick = () => {
  sendResult(true);
};
