import { HandlerFactory, ISenderDetails } from '../handler-factory';
import { Extensions } from '..';
import { EventHandler } from '../event-handler';

interface INavigationState {
  canGoBack?: boolean;
  canGoForward?: boolean;
}

export class TabsPrivateAPI extends EventHandler {
  constructor() {
    super('tabsPrivate', ['onFaviconUpdated']);

    const handler = HandlerFactory.create('tabsPrivate', this);

    handler('stop', this.stop);
    handler('getNavigationState', this.getNavigationState);
  }

  public async getNavigationState(
    { session }: ISenderDetails,
    { tabId }: { tabId: number },
  ): Promise<INavigationState> {
    const tab = Extensions.instance.tabs.getTabById(session, tabId);
    if (!tab) return null;

    return { canGoBack: tab.canGoBack(), canGoForward: tab.canGoForward() };
  }

  public stop(
    { session }: ISenderDetails,
    {
      tabId,
    }: {
      tabId: number;
    },
  ) {
    const tab = Extensions.instance.tabs.getTabById(session, tabId);
    if (!tab) return;

    tab.stop();
  }
}
