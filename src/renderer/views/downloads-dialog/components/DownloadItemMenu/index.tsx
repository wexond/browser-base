import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { IDownloadItem } from '~/interfaces';
import { clipboard, ipcRenderer, remote, shell } from 'electron';
import {
  ICON_CHECK,
  ICON_PAUSE,
  ICON_RESUME,
  ICON_FOLDER,
  ICON_LINK,
  ICON_TRASH,
  ICON_CLOSE,
} from '~/renderer/constants';
import store from '../../store';
import {
  ContextMenu,
  ContextMenuItem,
  ContextMenuSeparator,
} from '~/renderer/components/ContextMenu';

const openItem =
  (item: IDownloadItem) => (e: React.MouseEvent<HTMLDivElement>) => {
    if (item.completed) {
      shell.openPath(item.savePath);
      store.closeAllDownloadMenu();
      e.stopPropagation();
    }
  };

const toggleOpenWhenDone =
  (item: IDownloadItem) => (e: React.MouseEvent<HTMLDivElement>) => {
    ipcRenderer.send('download-open-when-done', item.id);
    store.closeAllDownloadMenu();
    e.stopPropagation();
  };

const showInFolder =
  (item: IDownloadItem) => (e: React.MouseEvent<HTMLDivElement>) => {
    remote.shell.showItemInFolder(item.savePath);
    store.closeAllDownloadMenu();
    e.stopPropagation();
  };

const copyLink =
  (item: IDownloadItem) => (e: React.MouseEvent<HTMLDivElement>) => {
    clipboard.writeText(item.url);
    store.closeAllDownloadMenu();
    e.stopPropagation();
  };

const pauseDownload =
  (item: IDownloadItem) => (e: React.MouseEvent<HTMLDivElement>) => {
    ipcRenderer.send('download-pause', item.id);
    store.closeAllDownloadMenu();
    e.stopPropagation();
  };

const resumeDownload =
  (item: IDownloadItem) => (e: React.MouseEvent<HTMLDivElement>) => {
    ipcRenderer.send('download-resume', item.id);
    store.closeAllDownloadMenu();
    e.stopPropagation();
  };

const cancelDownload =
  (item: IDownloadItem) => (e: React.MouseEvent<HTMLDivElement>) => {
    ipcRenderer.send('download-cancel', item.id);
    store.closeAllDownloadMenu();
    e.stopPropagation();
  };

const removeDownload = (item: IDownloadItem) => {
  ipcRenderer.send('download-remove', item.id);
};

const trashDownload =
  (item: IDownloadItem) => (e: React.MouseEvent<HTMLDivElement>) => {
    shell
      .trashItem(item.savePath)
      .then((e) => {
        removeDownload(item);
        console.log('Downloaded item has been deleted successfully.');
      })
      .catch((err) => {
        const window = remote.getCurrentWindow();
        const dialog = remote.dialog;
        dialog.showMessageBox(window, {
          title: "Couldn't Delete File",
          buttons: ['cancel'],
          type: 'warning',
          message:
            "The Action can't be compeleted, Maybe the file is open or you have no delete permission. \r\n Close the file and try again.",
        });
        console.log("Couldn't delete downloaded item.", err);
      });
    store.closeAllDownloadMenu();
    e.stopPropagation();
  };

const removeDownloadItemFromList =
  (item: IDownloadItem) => (e: React.MouseEvent<HTMLDivElement>) => {
    removeDownload(item);
    store.closeAllDownloadMenu();
    e.stopPropagation();
  };

export const DownloadItemMenu = observer(
  ({ item, visible }: { item: IDownloadItem; visible: boolean }) => {
    return (
      <ContextMenu
        style={{
          top: 50,
          right: 10,
          width: 200,
          fontSize: 12,
        }}
        visible={visible}
      >
        {!item.canceled &&
          (item.completed ? (
            <ContextMenuItem onClick={openItem(item)} icon={' '}>
              Open file
            </ContextMenuItem>
          ) : (
            <ContextMenuItem
              onClick={toggleOpenWhenDone(item)}
              icon={item.openWhenDone ? ICON_CHECK : ' '}
            >
              Open when done
            </ContextMenuItem>
          ))}

        {!item.canceled && <ContextMenuSeparator />}

        {!item.completed &&
          !item.canceled &&
          (item.paused ? (
            <ContextMenuItem onClick={resumeDownload(item)} icon={ICON_RESUME}>
              Resume
            </ContextMenuItem>
          ) : (
            <ContextMenuItem onClick={pauseDownload(item)} icon={ICON_PAUSE}>
              Pause
            </ContextMenuItem>
          ))}
        {!item.canceled && (
          <ContextMenuItem onClick={showInFolder(item)} icon={ICON_FOLDER}>
            Show in folder
          </ContextMenuItem>
        )}
        <ContextMenuItem onClick={copyLink(item)} icon={ICON_LINK}>
          Copy download link
        </ContextMenuItem>

        <ContextMenuSeparator />

        {item.completed && (
          <ContextMenuItem onClick={trashDownload(item)} icon={ICON_TRASH}>
            Delete file
          </ContextMenuItem>
        )}
        {(item.completed || item.canceled) && (
          <ContextMenuItem
            onClick={removeDownloadItemFromList(item)}
            icon={ICON_CLOSE}
          >
            Remove from list
          </ContextMenuItem>
        )}
        {!item.completed && !item.canceled && (
          <ContextMenuItem onClick={cancelDownload(item)} icon={ICON_CLOSE}>
            Cancel
          </ContextMenuItem>
        )}
      </ContextMenu>
    );
  },
);
