export class HorizontalScrollbar {
  public containerElement: HTMLElement;
  public rootElement: HTMLElement;
  public thumbElement: HTMLElement;

  private isScrollingToEnd = false;
  private scrollTimeout: any;

  constructor(
    containerElement: HTMLElement,
    rootElement: HTMLElement,
    thumbElement: HTMLElement,
  ) {
    this.containerElement = containerElement;
    this.rootElement = rootElement;
    this.thumbElement = thumbElement;

    requestAnimationFrame(this.resizeScrollbar);
  }

  public resizeScrollbar = () => {
    const { scrollWidth, offsetWidth, scrollLeft } = this.containerElement;

    this.thumbElement.style.left = `${(scrollLeft / scrollWidth) *
      offsetWidth}px`;

    const thumbWidth = offsetWidth ** 2 / scrollWidth;
    this.thumbElement.style.width = `${thumbWidth}px`;
    this.rootElement.style.display =
      Math.ceil(thumbWidth) !== Math.ceil(offsetWidth) ? 'block' : 'none';

    requestAnimationFrame(this.resizeScrollbar);
  };

  public scrollToEnd = (milliseconds: number) => {
    const frame = () => {
      if (!this.isScrollingToEnd) return;
      this.containerElement.scrollLeft = this.containerElement.scrollWidth;
      requestAnimationFrame(frame);
    };

    if (!this.isScrollingToEnd) {
      this.isScrollingToEnd = true;
      frame();
    }

    clearTimeout(this.scrollTimeout);

    this.scrollTimeout = setTimeout(() => {
      this.isScrollingToEnd = false;
    }, milliseconds);
  };
}
