import { HandlerFactory, ISenderDetails } from '../handler-factory';
import { Extensions } from '..';
import { IBrowserAction } from '~/common/extensions/interfaces/browser-action';
import { EventHandler } from '../event-handler';

const getActionForTab = (action: IBrowserAction, tabId: number) =>
  action?.tabs?.has?.(tabId)
    ? {
        ...action,
        ...action.tabs.get(tabId),
      }
    : action;

export class BrowserActionPrivateAPI extends EventHandler {
  constructor() {
    super('browserActionPrivate', ['onUpdated', 'onVisibilityChange']);

    const handler = HandlerFactory.create('browserActionPrivate', this);
    handler('getAll', this.getAllInSession);
    handler('getAllInTab', this.getAllInTab);
  }

  public getAllInSession({ session }: ISenderDetails): IBrowserAction[] {
    const sessionActions = Extensions.instance.browserAction.sessionActionMap.get(
      session,
    );
    if (!sessionActions) return [];
    return Array.from(sessionActions.values());
  }

  public getAllInTab(
    { session }: ISenderDetails,
    { tabId }: { tabId: number },
  ): IBrowserAction[] {
    const tab = Extensions.instance.tabs.getTabById(session, tabId);
    if (!tab) return [];

    const tabSession = tab.session;
    const actions = this.getAllInSession({ session: tabSession });

    return actions.map((action) => getActionForTab(action, tabId));
  }

  public getForTab(
    session: Electron.Session,
    extensionId: string,
    tabId: number,
  ) {
    const sessionActions = Extensions.instance.browserAction.sessionActionMap.get(
      session,
    );
    if (!sessionActions) return null;
    return getActionForTab(sessionActions.get(extensionId), tabId);
  }
}
