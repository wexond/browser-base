import { ipcRenderer } from 'electron';

export const callViewMethod = async (
  windowId: number,
  id: number,
  scope: string,
  ...args: any[]
): Promise<any> => {
  return await ipcRenderer.invoke(`browserview-call-${windowId}`, {
    args,
    scope,
    tabId: id,
  });
};
