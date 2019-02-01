export class HorizontalScrollbar {
  public containerElement: HTMLElement;
  public rootElement: HTMLElement;
  public thumbElement: HTMLElement;

  private isScrollingToEnd = false;
  private scrollTimeout: any;

  private scrollData = {
    dragging: false,
    mouseStartX: 0,
    startLeft: 0,
  };

  private thumbLeft: number;
  private _visible = false;

  constructor(
    containerElement: HTMLElement,
    rootElement: HTMLElement,
    thumbElement: HTMLElement,
  ) {
    this.containerElement = containerElement;
    this.rootElement = rootElement;
    this.thumbElement = thumbElement;

    requestAnimationFrame(this.resizeScrollbar);

    this.thumbElement.onmousedown = this.onMouseDown;
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);
    this.containerElement.addEventListener('wheel', this.onWheel);
  }

  public set visible(val: boolean) {
    this._visible = val;

    if (val) {
      this.thumbElement.classList.add('visible');
    } else {
      this.thumbElement.classList.remove('visible');
    }
  }

  public get visible() {
    return this._visible;
  }

  public onWheel = (e: any) => {
    const { deltaX, deltaY } = e;
    const { scrollLeft } = this.containerElement;

    const delta = Math.abs(deltaX) >= Math.abs(deltaY) ? deltaX : -deltaY;
    const target = delta / 2;

    this.isScrollingToEnd = false;

    this.containerElement.scrollLeft = scrollLeft + target;
  };

  public onMouseUp = () => {
    this.scrollData = {
      ...this.scrollData,
      dragging: false,
    };
  };

  public onMouseMove = (e: any) => {
    if (this.scrollData.dragging && this.containerElement) {
      const { startLeft, mouseStartX } = this.scrollData;
      const { offsetWidth, scrollWidth } = this.containerElement;
      this.containerElement.scrollLeft =
        ((startLeft + e.pageX - mouseStartX) / offsetWidth) * scrollWidth;
    }
  };

  public onMouseDown = (e: any) => {
    this.isScrollingToEnd = false;

    this.scrollData = {
      ...this.scrollData,
      dragging: true,
      mouseStartX: e.pageX,
      startLeft: this.thumbLeft,
    };
  };

  public resizeScrollbar = () => {
    const { scrollWidth, offsetWidth, scrollLeft } = this.containerElement;

    this.thumbLeft = (scrollLeft / scrollWidth) * offsetWidth;
    this.thumbElement.style.left = `${this.thumbLeft}px`;

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
