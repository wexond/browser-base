export const createElement = (
  name: string,
  props: any = null,
  ...children: HTMLElement[]
) => {
  const element = document.createElement(name);

  for (const child of children) {
    if (typeof child === 'string') {
      element.textContent = child;
    } else {
      element.appendChild(child);
    }
  }

  if (props) {
    for (const key in props) {
      if (key === 'className') {
        element.setAttribute('class', props[key]);
      } else if (key === 'ref') {
        props[key](element);
      } else {
        element.setAttribute(key, props[key]);
      }
    }
  }

  return element;
};
