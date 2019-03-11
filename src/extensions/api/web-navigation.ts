import { IpcEvent } from '..';

// https://developer.chrome.com/extensions/webNavigation

export class WebNavigation {
  public onBeforeNavigate = new IpcEvent('webNavigation', 'onBeforeNavigate');
  public onCommitted = new IpcEvent('webNavigation', 'onCommitted');
  public onDOMContentLoaded = new IpcEvent(
    'webNavigation',
    'onDOMContentLoaded',
  );
  public onCompleted = new IpcEvent('webNavigation', 'onCompleted');
  public onCreatedNavigationTarget = new IpcEvent(
    'webNavigation',
    'onCreatedNavigationTarget',
  );
  public onReferenceFragmentUpdated = new IpcEvent(
    'webNavigation',
    'onReferenceFragmentUpdated',
  ); // TODO
  public onTabReplaced = new IpcEvent('webNavigation', 'onTabReplaced'); // TODO
  public onHistoryStateUpdated = new IpcEvent(
    'webNavigation',
    'onHistoryStateUpdated',
  ); // TODO
}
