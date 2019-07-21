import { ipcRenderer, remote, webFrame } from 'electron';
import { getFormFields, insertFieldValue } from './utils';
import { TEST_DATA } from './constants/test';

const tabId = remote.getCurrentWebContents().id;

const goBack = () => {
  ipcRenderer.send('browserview-call', { tabId, scope: 'webContents.goBack' });
};

const goForward = () => {
  ipcRenderer.send('browserview-call', {
    tabId,
    scope: 'webContents.goForward',
  });
};

window.addEventListener('mouseup', e => {
  if (e.button === 3) {
    goBack();
  } else if (e.button === 4) {
    goForward();
  }
});

webFrame.executeJavaScript('window', false, (w: any) => { });

let beginningScrollLeft: number = null;
let beginningScrollRight: number = null;
let horizontalMouseMove = 0;
let verticalMouseMove = 0;

const resetCounters = () => {
  beginningScrollLeft = null;
  beginningScrollRight = null;
  horizontalMouseMove = 0;
  verticalMouseMove = 0;
};

function getScrollStartPoint(x: number, y: number) {
  let left = 0;
  let right = 0;

  let n = document.elementFromPoint(x, y);

  while (n) {
    if (n.scrollLeft !== undefined) {
      left = Math.max(left, n.scrollLeft);
      right = Math.max(right, n.scrollWidth - n.clientWidth - n.scrollLeft);
    }
    n = n.parentElement;
  }
  return { left, right };
}

document.addEventListener('wheel', e => {
  verticalMouseMove += e.deltaY;
  horizontalMouseMove += e.deltaX;

  if (beginningScrollLeft === null || beginningScrollRight === null) {
    const result = getScrollStartPoint(e.deltaX, e.deltaY);
    beginningScrollLeft = result.left;
    beginningScrollRight = result.right;
  }
});

ipcRenderer.on('scroll-touch-end', () => {
  if (
    horizontalMouseMove - beginningScrollRight > 150 &&
    Math.abs(horizontalMouseMove / verticalMouseMove) > 2.5
  ) {
    if (beginningScrollRight < 10) {
      goForward();
    }
  }

  if (
    horizontalMouseMove + beginningScrollLeft < -150 &&
    Math.abs(horizontalMouseMove / verticalMouseMove) > 2.5
  ) {
    if (beginningScrollLeft < 10) {
      goBack();
    }
  }

  resetCounters();
});

const dev = (e: any) => {
  e.preventDefault();
  e.stopPropagation();
  const button = document.querySelector('input[type=button]') as HTMLButtonElement;
  button.removeAttribute('disabled');
  button.value = 'Sign in';
}

window.addEventListener('load', () => {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', onFormSubmit)
  })

  const button = document.querySelector('input[type=button]') as HTMLButtonElement;

  button.addEventListener('click', (e: Event) => {
    onFormSubmit({ ...e, target: document.getElementsByTagName('form')[0] });
  });
});

const onFormSubmit = (e: Event) => {
  const form = e.target as HTMLFormElement;
  const inputs = getFormFields(form);

  for (const input of inputs) {
    insertFieldValue(input, TEST_DATA[0]);
  }
}

window.onload = () => {
  requestAnimationFrame(() => {
    document.body.style.backgroundColor = '#fff';
  })
}
