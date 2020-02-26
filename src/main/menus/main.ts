import { Menu, webContents, app, BrowserWindow, MenuItem } from 'electron';
import { defaultTabOptions } from '~/constants/tabs';
import { WindowsManager } from '../windows-manager';
import { viewSource, saveAs, printPage } from './common-actions';
import { WEBUI_BASE_URL, WEBUI_URL_SUFFIX } from '~/constants/files';
import { AppWindow } from '../windows';

const createShortcutMenuItem = (
  shortcuts: string[],
  action: (
    window: AppWindow,
    menuItem: MenuItem,
    shortcutIndex: number,
  ) => void,
  label: string = null,
) => {
  const result: any = shortcuts.map((shortcut, key) => ({
    accelerator: shortcut,
    visible: label != null && key === 0,
    label: label != null && key === 0 ? label : '',
    click: (menuItem: MenuItem, browserWindow: BrowserWindow) =>
      action(browserWindow as AppWindow, menuItem, key),
  }));

  return result;
};

export const getMainMenu = (windowsManager: WindowsManager) => {
  const template: any = [
    ...(process.platform === 'darwin'
      ? [
          {
            label: app.name,
            submenu: [
              { role: 'about' },
              { type: 'separator' },
              { role: 'services' },
              { type: 'separator' },
              { role: 'hide' },
              { role: 'hideothers' },
              { role: 'unhide' },
              { type: 'separator' },
              { role: 'quit' },
            ],
          },
        ]
      : []),
    {
      label: 'File',
      submenu: [
        ...createShortcutMenuItem(
          ['CmdOrCtrl+N'],
          () => {
            windowsManager.createWindow();
          },
          'New window',
        ),
        ...createShortcutMenuItem(
          ['CmdOrCtrl+Shift+N'],
          () => {
            windowsManager.createWindow(true);
          },
          'New incognito window',
        ),
        ...createShortcutMenuItem(
          ['CmdOrCtrl+T'],
          window => {
            window.viewManager.create(defaultTabOptions);
          },
          'New tab',
        ),
        ...createShortcutMenuItem(
          ['CmdOrCtrl+Shift+T'],
          window => {
            window.webContents.send('revert-closed-tab');
          },
          'Revert closed tab',
        ),
        {
          type: 'separator',
        },
        ...createShortcutMenuItem(
          ['CmdOrCtrl+Shift+W'],
          window => {
            window.close();
          },
          'Close window',
        ),
        ...createShortcutMenuItem(
          ['CmdOrCtrl+W', 'CmdOrCtrl+F4'],
          window => {
            window.webContents.send(
              'remove-tab',
              window.viewManager.selectedId,
            );
          },
          'Close tab',
        ),
        {
          type: 'separator',
        },
        ...createShortcutMenuItem(
          ['CmdOrCtrl+S'],
          () => {
            saveAs();
          },
          'Save webpage as...',
        ),
        {
          type: 'separator',
        },
        ...createShortcutMenuItem(
          ['CmdOrCtrl+P'],
          () => {
            printPage();
          },
          'Print',
        ),

        // Hidden items

        // Focus address bar
        ...createShortcutMenuItem(
          ['Ctrl+Space', 'CmdOrCtrl+L', 'Alt+D', 'F6'],
          () => {
            windowsManager.currentWindow.dialogs.searchDialog.show();
          },
        ),

        // Toggle menu
        ...createShortcutMenuItem(['Alt+F', 'Alt+E'], () => {
          windowsManager.currentWindow.dialogs.menuDialog.show();
        }),
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        ...(process.platform === 'darwin'
          ? [
              { role: 'pasteAndMatchStyle' },
              { role: 'delete' },
              { role: 'selectAll' },
              { type: 'separator' },
              {
                label: 'Speech',
                submenu: [{ role: 'startspeaking' }, { role: 'stopspeaking' }],
              },
            ]
          : [{ role: 'delete' }, { type: 'separator' }, { role: 'selectAll' }]),
        { type: 'separator' },
        ...createShortcutMenuItem(
          ['CmdOrCtrl+F'],
          () => {
            windowsManager.currentWindow.webContents.send('find');
          },
          'Find in page',
        ),
      ],
    },
    {
      label: 'View',
      submenu: [
        ...createShortcutMenuItem(
          ['CmdOrCtrl+R', 'F5'],
          () => {
            windowsManager.currentWindow.viewManager.selected.webContents.reload();
          },
          'Reload',
        ),
        ...createShortcutMenuItem(
          ['CmdOrCtrl+Shift+R', 'Shift+F5'],
          () => {
            windowsManager.currentWindow.viewManager.selected.webContents.reloadIgnoringCache();
          },
          'Reload ignoring cache',
        ),
      ],
    },
    {
      label: 'History',
      submenu: [
        // TODO: Homepage - Ctrl+Shift+H
        ...createShortcutMenuItem(
          ['Alt+Left'],
          () => {
            const { selected } = windowsManager.currentWindow.viewManager;
            if (selected) {
              selected.webContents.goBack();
            }
          },
          'Go back',
        ),
        ...createShortcutMenuItem(
          ['Alt+Right'],
          () => {
            const { selected } = windowsManager.currentWindow.viewManager;
            if (selected) {
              selected.webContents.goForward();
            }
          },
          'Go forward',
        ),
        // { type: 'separator' }
        // TODO: list last closed tabs
        // { type: 'separator' }
        // TODO: list last visited
        { type: 'separator' },
        ...createShortcutMenuItem(
          ['CmdOrCtrl+H'],
          () => {
            windowsManager.currentWindow.viewManager.create({
              url: `${WEBUI_BASE_URL}history${WEBUI_URL_SUFFIX}`,
              active: true,
            });
          },
          'Manage history',
        ),
      ],
    },
    {
      label: 'Bookmarks',
      submenu: [
        ...createShortcutMenuItem(
          ['CmdOrCtrl+Shift+O'],
          () => {
            windowsManager.currentWindow.viewManager.create({
              url: `${WEBUI_BASE_URL}bookmarks${WEBUI_URL_SUFFIX}`,
              active: true,
            });
          },
          'Manage bookmarks',
        ),
        ...createShortcutMenuItem(
          ['CmdOrCtrl+D'],
          () => {
            windowsManager.currentWindow.webContents.send(
              'show-add-bookmark-dialog',
            );
          },
          'Add this website to bookmarks',
        ),
        // { type: 'separator' }
        // TODO: list bookmarks
      ],
    },
    {
      label: 'Tools',
      submenu: [
        {
          label: 'Developer',
          submenu: [
            ...createShortcutMenuItem(
              ['CmdOrCtrl+U'],
              () => {
                viewSource();
              },
              'View source',
            ),
            ...createShortcutMenuItem(
              ['F12', 'Ctrl+Shift+I'],
              () => {
                setTimeout(() => {
                  windowsManager.currentWindow.viewManager.selected.webContents.toggleDevTools();
                });
              },
              'Developer tools...',
            ),

            // Developer tools (current webContents) (dev)
            ...createShortcutMenuItem(['CmdOrCtrl+Shift+F12'], () => {
              setTimeout(() => {
                webContents
                  .getFocusedWebContents()
                  .openDevTools({ mode: 'detach' });
              });
            }),
          ],
        },
      ],
    },
    {
      label: 'Tab',
      submenu: [
        ...createShortcutMenuItem(
          ['CmdOrCtrl+Tab', 'CmdOrCtrl+PageDown'],
          () => {
            windowsManager.currentWindow.webContents.send('select-next-tab');
          },
          'Select next tab',
        ),
        ...createShortcutMenuItem(
          ['CmdOrCtrl+Shift+Tab', 'CmdOrCtrl+PageUp'],
          () => {
            windowsManager.currentWindow.webContents.send(
              'select-previous-tab',
            );
          },
          'Select previous tab',
        ),
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        ...(process.platform === 'darwin'
          ? [
              { type: 'separator' },
              { role: 'front' },
              { type: 'separator' },
              { role: 'window' },
            ]
          : [{ role: 'close' }]),
        { type: 'separator' },
        {
          label: 'Always on top',
          type: 'checkbox',
          checked: false,
          click(menuItem: MenuItem, browserWindow: BrowserWindow) {
            browserWindow.setAlwaysOnTop(!browserWindow.isAlwaysOnTop());
            menuItem.checked = browserWindow.isAlwaysOnTop();
          },
        },
      ],
    },
  ];

  // Ctrl+1 - Ctrl+8
  template[0].submenu = template[0].submenu.concat(
    createShortcutMenuItem(
      Array.from({ length: 8 }, (v, k) => k + 1).map(i => `CmdOrCtrl+${i}`),
      (window, menuItem, i) => {
        windowsManager.currentWindow.webContents.send('select-tab-index', i);
      },
    ),
  );

  // Ctrl+9
  template[0].submenu = template[0].submenu.concat(
    createShortcutMenuItem(['CmdOrCtrl+9'], () => {
      windowsManager.currentWindow.webContents.send('select-last-tab');
    }),
  );

  return Menu.buildFromTemplate(template);
};
