// https://developer.chrome.com/extensions/extension

export class Extension {
  /**
   * True for content scripts running inside incognito tabs,
   * and for extension pages running inside an incognito process.
   * The latter only applies to extensions with 'split' incognito_behavior.
   *
   * @type {boolean}
   */
  public inIncognitoContext = false; // TODO
}
