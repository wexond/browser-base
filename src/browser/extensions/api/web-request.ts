import { webContents, ipcMain } from 'electron';
import { EventHandler, IEventDetails } from '../event-handler';
import extendElectronWebRequest from '../extend-web-request';
import { Extensions } from '..';

const clearCacheOnNavigation = () => {
  webContents.getAllWebContents().forEach((wc) => {
    const onNavigation = true;
    // TODO(sentialx): receive clear-cache in renderer
    wc.send('clear-cache', onNavigation);
  });
};

function toArrayBuffer(buffer: Buffer) {
  if (!buffer) return undefined;
  const ab = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(ab);
  for (let i = 0; i < buffer.length; ++i) {
    view[i] = buffer[i];
  }
  return ab;
}

const electronToChromeRequestType = (type: string): any => {
  if (type === 'mainFrame') return 'main_frame';
  if (type === 'subFrame') return 'sub_frame';
  if (type === 'cspReport') return 'csp_report';
  return type;
};

const chromeToElectronHeaders = (headers: any) => {
  const newHeaders: any = {};
  headers.forEach((header: any) => (newHeaders[header.name] = [header.value]));
  return newHeaders;
};

const electronToChromeDetails = (details: any) => {
  const newDetails = {
    ...details,
    requestId: details.id.toString(),
    frameId: 0,
    parentFrameId: -1,
    type: electronToChromeRequestType(details.resourceType),
    timeStamp: Date.now(),
    tabId: details.webContentsId,
    error: '',
  };

  if (newDetails.responseHeaders) {
    newDetails.responseHeaders = Object.keys(newDetails.responseHeaders).map(
      (k) => ({
        name: k,
        value: newDetails.responseHeaders[k][0],
      }),
    );
  }

  if (newDetails.uploadData) {
    newDetails.uploadData = newDetails.uploadData.map((x) => ({
      bytes: toArrayBuffer(x.bytes),
      file: x.file,
    }));
  }

  return newDetails;
};

export class WebRequestAPI extends EventHandler {
  constructor() {
    super('webRequest', [
      'onBeforeRequest',
      'onBeforeSendHeaders',
      'onSendHeaders',
      'onHeadersReceived',
      'onAuthRequired',
      'onBeforeRedirect',
      'onResponseStarted',
      'onCompleted',
      'onErrorOccurred',
    ]);
    // TODO(sentialx): send clear-cache from renderer
    ipcMain.on('clear-cache', () => {
      clearCacheOnNavigation();
    });

    this.on('addListener', this.addListenerHandler);
  }

  private addListenerHandler = (eventDetails: IEventDetails, filter: any) => {
    const { webRequest }: any = extendElectronWebRequest(eventDetails.session);

    // Ignore unknown webRequest event names.
    if (
      !Object.getOwnPropertyNames(webRequest.webRequest).includes(
        eventDetails.name,
      )
    )
      return;

    clearCacheOnNavigation();

    if (filter === undefined) filter = {};

    const { id }: any = webRequest.addListener(
      eventDetails.name,
      filter,
      async (details: any, callback: any) => {
        if (
          !Extensions.instance.tabs.getTabById(
            eventDetails.session,
            details.webContentsId,
          )
        )
          return callback(details);

        const returnedDetails = await this.invokeEvent(
          eventDetails,
          electronToChromeDetails(details),
        );

        if (!returnedDetails) return callback(details);

        if (returnedDetails.responseHeaders) {
          returnedDetails.responseHeaders = chromeToElectronHeaders(
            returnedDetails.responseHeaders,
          );
        }

        return callback(returnedDetails);
      },
    );

    // TODO: removeListener
    // ipcMain.on(`webRequest.removeListener-${listenerId}`, () => {
    //   webRequest.removeListener(name, id);
    // });
  };
}
