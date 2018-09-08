import { WebRequestEvent } from '@/models/extensions';

export class WebRequest {
  public ResourceType = {
    CSP_REPORT: 'csp_report',
    FONT: 'font',
    IMAGE: 'image',
    MAIN_FRAME: 'main_frame',
    MEDIA: 'media',
    OBJECT: 'object',
    OTHER: 'other',
    PING: 'ping',
    SCRIPT: 'script',
    STYLESHEET: 'stylesheet',
    SUB_FRAME: 'sub_frame',
    WEBSOCKET: 'websocket',
    XMLHTTPREQUEST: 'xmlhttprequest',
  };

  public onBeforeRequest = new WebRequestEvent('onBeforeRequest');
  public onBeforeSendHeaders = new WebRequestEvent('onBeforeSendHeaders');
  public onHeadersReceived = new WebRequestEvent('onHeadersReceived');
  public onSendHeaders = new WebRequestEvent('onSendHeaders');
  public onResponseStarted = new WebRequestEvent('onResponseStarted');
  public onBeforeRedirect = new WebRequestEvent('onBeforeRedirect');
  public onCompleted = new WebRequestEvent('onCompleted');
  public onErrorOccurred = new WebRequestEvent('onErrorOccurred');
}
