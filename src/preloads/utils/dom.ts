export const isVisible = (el: HTMLElement) => {
  return el.offsetHeight !== 0;
};

const getInput = (name: string): HTMLInputElement => {
  return document.querySelector(`input[name="${name}"]`);
};

export const setInputValue = (value: string, ...names: string[]) => {
  if (!value) return;

  for (const name of names) {
    const input = getInput(name);

    if (input) {
      input.value = value;
      return;
    }
  }
};
