import { extname } from 'path';
import { dialog } from 'electron';
import { windowsManager } from '..';

export const saveAs = async () => {
  const wc = windowsManager.currentWindow.viewManager.selected.webContents;

  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath: wc.getTitle(),
    filters: [
      { name: 'Webpage, Complete', extensions: ['html', 'htm'] },
      { name: 'Webpage, HTML Only', extensions: ['htm', 'html'] },
    ],
  });

  if (canceled) return;

  const ext = extname(filePath);

  wc.savePage(filePath, ext === '.htm' ? 'HTMLOnly' : 'HTMLComplete');
};

export const viewSource = async () => {
  const vm = windowsManager.currentWindow.viewManager;

  vm.create(
    {
      url: `view-source:${vm.selected.webContents.getURL()}`,
      active: true,
    },
    true,
  );
};

export const printPage = () => {
  const wc = windowsManager.currentWindow.viewManager.selected.webContents;
  wc.print();
};
