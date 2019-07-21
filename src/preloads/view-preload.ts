import { ipcRenderer, remote, webFrame } from 'electron';

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
  const button = document.querySelector('input[type=submit]') as HTMLButtonElement;
  button.removeAttribute('disabled');
  button.value = 'Sign in';
}

const isVisible = (element: HTMLElement) => {
  return element.offsetHeight !== 0;
}

const inputFilters = {
  type: /text|email|password/i,
  name: /login|username|email|password/i,
}

const getFormInputs = (form: HTMLFormElement) => {
  const id = form.getAttribute('id');
  const inside: HTMLInputElement[] = Array.from(form.querySelectorAll('input'));
  const outside: HTMLInputElement[] = id != null ? Array.from(document.querySelectorAll(`input[form=${id}]`)) : [];
  return [...inside, ...outside];
}

const testInput = (input: HTMLInputElement) => {
  const type = input.getAttribute('type');
  const name = input.getAttribute('name');
  return isVisible(input) && inputFilters.type.test(type) && inputFilters.name.test(name);
}

window.addEventListener('load', () => {
  const forms = document.querySelectorAll('form');

  forms.forEach(form => {
    form.addEventListener('submit', onFormSubmit)
  })
});

const onFormSubmit = (e: Event) => {
  dev(e);

  const form = e.target as HTMLFormElement;
  const inputs = getFormInputs(form);

  for (const input of inputs) {
    if (testInput(input)) {
      const type = input.getAttribute('type');
      const name = input.getAttribute('name').toLowerCase();

      console.log(type, name, input.value);
    }
  }
}
