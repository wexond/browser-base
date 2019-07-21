export const isVisible = (el: HTMLElement) => {
  return el.offsetHeight !== 0;
}

export const searchElements = (el: Document | HTMLElement, query: string) => {
  return Array.from(el.querySelectorAll(query)) as HTMLElement[];
}
