export default class PageModel {
  public title: string;

  public url: string;

  public favicon: string;

  constructor(title: string = '', url: string = '', favicon: string = null) {
    this.title = title;
    this.url = url;
    this.favicon = favicon;
  }
}
