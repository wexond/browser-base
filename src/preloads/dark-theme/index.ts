import { colorBrightness } from '@/utils/colors';

export const applyDarkTheme = () => {
  colorizeChildren(document.body);

  const config: MutationObserverInit = {
    attributes: true,
    childList: true,
    subtree: true,
  };

  const callback: MutationCallback = (mutationsList: MutationRecord[]) => {
    for (const mutation of mutationsList) {
      colorizeChildren(mutation.target);
    }
  };

  const observer = new MutationObserver(callback);
  observer.observe(document.body, config);
};

export const colorizeChildren = (
  nodes: Node | NodeListOf<Node & ChildNode>,
) => {
  if (nodes instanceof Node) {
    colorize(nodes);
    colorizeChildren(nodes.childNodes);
  } else {
    for (let i = 0; i < nodes.length; i++) {
      colorize(nodes[i]);
      colorizeChildren(nodes[i].childNodes);
    }
  }
};

export const colorize = (node: Node) => {
  const element = node as HTMLElement;
  if (element == null || element.style == null) return;
  if (element.classList.contains('wexond-dark-theme')) return;

  const style = window.getComputedStyle(element, null);

  const background = style.getPropertyValue('background-color');

  if (background !== 'rgba(0, 0, 0, 0)' && !background.startsWith('rgba')) {
    const brightness = colorBrightness(background);

    if (brightness >= 189) {
      element.style.backgroundColor = '#212121';
    } else {
      element.style.backgroundColor = '#fff';
    }
  }

  element.style.color = '#fff';

  element.classList.add('wexond-dark-theme');
};
