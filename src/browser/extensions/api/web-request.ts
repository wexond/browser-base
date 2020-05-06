import { webContents, ipcMain } from 'electron';
import { sessionFromIpcEvent } from '../utils/session';
import { webContentsInvoke } from '../utils/web-contents';
import extendElectronWebRequest from '../utils/web-request';

const clearCacheOnNavigation = () => {
  webContents.getAllWebContents().forEach((wc) => {
    const onNavigation = true;
    // TODO(sentialx): receive clear-cache in renderer
    wc.send('clear-cache', onNavigation);
  });
};

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

  return newDetails;
};

export class WebRequestAPI {
  constructor() {
    // TODO(sentialx): send clear-cache from renderer
    ipcMain.on('clear-cache', () => {
      clearCacheOnNavigation();
    });

    ipcMain.on('webRequest.addListener', this.addListener);
  }

  private addListener = (
    e: Electron.IpcMainEvent,
    listenerId: string,
    name: string,
    filter: any,
  ) => {
    const session = sessionFromIpcEvent(e);
    const { webRequest }: any = extendElectronWebRequest(session);

    // Ignore unknown webRequest event names.
    if (!Object.getOwnPropertyNames(webRequest.webRequest).includes(name))
      return;

    clearCacheOnNavigation();

    const { id }: any = webRequest.addListener(
      name,
      filter,
      async (details: any, callback: any) => {
        const returnedDetails = await webContentsInvoke(
          e.sender,
          listenerId,
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

    ipcMain.on(`webRequest.removeListener-${listenerId}`, () => {
      webRequest.removeListener(name, id);
    });
  };
}
