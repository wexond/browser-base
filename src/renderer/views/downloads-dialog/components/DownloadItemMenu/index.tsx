import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { IDownloadItem } from '~/interfaces';
import { clipboard, ipcRenderer, remote, shell } from 'electron';
import {
  ICON_PAUSE,
  ICON_RESUME,
  ICON_CLOSE,
  ICON_CHECK,
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
    store.toggleOpenWhenDone(item);
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
        <ContextMenuSeparator />
        {!item.completed && !item.canceled && (
          <ContextMenuItem onClick={cancelDownload(item)} icon={ICON_CLOSE}>
            Cancel
          </ContextMenuItem>
        )}
      </ContextMenu>
    );
  },
);
