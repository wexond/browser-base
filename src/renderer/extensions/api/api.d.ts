interface Window { browser: typeof chrome & typeof browser }

declare namespace browser.browserAction {
  export type ColorArray = number[];
  export type ImageDataType = ImageData;
  export function setTitle(details: {
    title: string;
    tabId?: number;
  }, callback?: () => void): void;
  export function getTitle(details: {
    tabId?: number;
  }, callback?: (result: string) => void): Promise<string>;
  export function setIcon(details: {
    imageData?: ImageDataType | any;
    path?: string | any;
    tabId?: number;
  }, callback?: () => void): void;
  export function setPopup(details: {
    tabId?: number;
    popup: string;
  }, callback?: () => void): void;
  export function getPopup(details: {
    tabId?: number;
  }, callback?: (result: string) => void): Promise<string>;
  export function setBadgeText(details: {
    text?: string;
    tabId?: number;
  }, callback?: () => void): void;
  export function getBadgeText(details: {
    tabId?: number;
  }, callback?: (result: string) => void): Promise<string>;
  export function setBadgeBackgroundColor(details: {
    color: string | ColorArray;
    tabId?: number;
  }, callback?: () => void): void;
  export function getBadgeBackgroundColor(details: {
    tabId?: number;
  }, callback?: (result: ColorArray) => void): Promise<ColorArray>;
  export function enable(tabId?: number, callback?: () => void): void;
  export function disable(tabId?: number, callback?: () => void): void;
  export function openPopup(callback?: (popupView?: any) => void): Promise<any>;
  export const onClicked: chrome.events.Event<(tab: browser.tabs.Tab) => void>;
}

declare namespace browser.browserActionPrivate {
  export interface OpenPopupDetails {
    left?: number;
    top?: number;
    inspect?: boolean;
  }
  export function getAll(): void;
  export function getAllInTab(tabId: number): void;
  export function openPopup(extensionId: string, details: OpenPopupDetails): void;
  export const onUpdated: chrome.events.Event<(browserAction: number) => void>;
}

declare namespace browser.cookies {
  export interface Cookie {
    name: string;
    value: string;
    domain: string;
    hostOnly: boolean;
    path: string;
    secure: boolean;
    httpOnly: boolean;
    sameSite: SameSiteStatus;
    session: boolean;
    expirationDate?: number;
    storeId: string;
  }
  export interface CookieStore {
    id: string;
    tabIds: number[];
  }
  export function get(details: {
    url: string;
    name: string;
    storeId?: string;
  }, callback?: (cookie?: Cookie) => void): Promise<Cookie>;
  export function getAll(details: {
    url?: string;
    name?: string;
    domain?: string;
    path?: string;
    secure?: boolean;
    session?: boolean;
    storeId?: string;
  }, callback?: (cookies: Cookie[]) => void): Promise<Cookie[]>;
  export function set(details: {
    url: string;
    name?: string;
    value?: string;
    domain?: string;
    path?: string;
    secure?: boolean;
    httpOnly?: boolean;
    sameSite?: SameSiteStatus;
    expirationDate?: number;
    storeId?: string;
  }, callback?: (cookie?: Cookie) => void): Promise<Cookie>;
  export function remove(details: {
    url: string;
    name: string;
    storeId?: string;
  }, callback?: (details?: {
    url: string;
    name: string;
    storeId: string;
  }) => void): Promise<{
    url: string;
    name: string;
    storeId: string;
  }>;
  export function getAllCookieStores(callback?: (cookieStores: CookieStore[]) => void): Promise<CookieStore[]>;
  export const onChanged: chrome.events.Event<(changeInfo: {
    removed: boolean;
    cookie: Cookie;
    cause: OnChangedCause;
  }) => void>;
}

declare namespace browser.dialogsPrivate {
  export const onVisibilityStateChange: chrome.events.Event<(name: string, visible: boolean) => void>;
}

declare namespace browser.events {
  export interface Rule {
    id?: string;
    tags?: string[];
    conditions: any[];
    actions: any[];
    priority?: number;
  }
  export interface Event<T extends Function> {
    addListener(callback: T): void;
    getRules(callback: (rules: Rule[]) => void): void;
    getRules(ruleIdentifiers: string[], callback: (rules: Rule[]) => void): void;
    hasListener(callback: T): boolean;
    removeRules(ruleIdentifiers?: string[], callback?: () => void): void;
    removeRules(callback?: () => void): void;
    addRules(rules: Rule[], callback?: (rules: Rule[]) => void): void;
    removeListener(callback: T): void;
    hasListeners(): boolean;
  }
  export interface UrlFilter {
    hostContains?: string;
    hostEquals?: string;
    hostPrefix?: string;
    hostSuffix?: string;
    pathContains?: string;
    pathEquals?: string;
    pathPrefix?: string;
    pathSuffix?: string;
    queryContains?: string;
    queryEquals?: string;
    queryPrefix?: string;
    querySuffix?: string;
    urlContains?: string;
    urlEquals?: string;
    urlMatches?: string;
    originAndPathMatches?: string;
    urlPrefix?: string;
    urlSuffix?: string;
    schemes?: string[];
    ports?: number[] | number[][];
  }
}

declare namespace browser.extensionTypes {
  export interface ImageDetails {
    format?: ImageFormat;
    quality?: number;
  }
  export interface InjectDetails {
    code?: string;
    file?: string;
    allFrames?: boolean;
    frameId?: number;
    matchAboutBlank?: boolean;
    runAt?: RunAt;
    cssOrigin?: CSSOrigin;
  }
}

declare namespace browser.runtime {
  export function openOptionsPage(callback?: () => void): void;
  export function setUninstallURL(url: string, callback?: () => void): void;
  export function requestUpdateCheck(callback?: (status: RequestUpdateCheckStatus, details?: {
    version: string;
  }) => void): Promise<RequestUpdateCheckStatus>;
  export function restart(): void;
  export function restartAfterDelay(seconds: number, callback?: () => void): void;
  export const onStartup: chrome.events.Event<() => void>;
  export const onInstalled: chrome.events.Event<(details: {
    reason: OnInstalledReason;
    previousVersion?: string;
    id?: string;
  }) => void>;
  export const onSuspend: chrome.events.Event<() => void>;
  export const onSuspendCanceled: chrome.events.Event<() => void>;
  export const onUpdateAvailable: chrome.events.Event<(details: {
    version: string;
  }) => void>;
  export const onBrowserUpdateAvailable: chrome.events.Event<() => void>;
  export const onRestartRequired: chrome.events.Event<(reason: OnRestartRequiredReason) => void>;
}

declare namespace browser.tabs {
  export interface MutedInfo {
    muted: boolean;
    reason?: MutedInfoReason;
    extensionId?: string;
  }
  export interface Tab {
    id?: number;
    index: number;
    windowId: number;
    openerTabId?: number;
    selected: boolean;
    highlighted: boolean;
    active: boolean;
    pinned: boolean;
    audible?: boolean;
    discarded: boolean;
    autoDiscardable: boolean;
    mutedInfo?: MutedInfo;
    url?: string;
    pendingUrl?: string;
    title?: string;
    favIconUrl?: string;
    status?: TabStatus;
    incognito: boolean;
    width?: number;
    height?: number;
    sessionId?: string;
  }
  export interface ZoomSettings {
    mode?: ZoomSettingsMode;
    scope?: ZoomSettingsScope;
    defaultZoomFactor?: number;
  }
  export function get(tabId: number, callback?: (tab: Tab) => void): Promise<Tab>;
  export function getCurrent(callback?: (tab?: Tab) => void): Promise<Tab>;
  export function getSelected(windowId?: number, callback?: (tab: Tab) => void): Promise<Tab>;
  export function getAllInWindow(windowId?: number, callback?: (tabs: Tab[]) => void): Promise<Tab[]>;
  export function create(createProperties: {
    windowId?: number;
    index?: number;
    url?: string;
    active?: boolean;
    selected?: boolean;
    pinned?: boolean;
    openerTabId?: number;
  }, callback?: (tab: Tab) => void): Promise<Tab>;
  export function duplicate(tabId: number, callback?: (tab?: Tab) => void): Promise<Tab>;
  export function query(queryInfo: {
    active?: boolean;
    pinned?: boolean;
    audible?: boolean;
    muted?: boolean;
    highlighted?: boolean;
    discarded?: boolean;
    autoDiscardable?: boolean;
    currentWindow?: boolean;
    lastFocusedWindow?: boolean;
    status?: TabStatus;
    title?: string;
    url?: string | string[];
    windowId?: number;
    windowType?: WindowType;
    index?: number;
  }, callback?: (result: Tab[]) => void): Promise<Tab[]>;
  export function highlight(highlightInfo: {
    windowId?: number;
    tabs: number[] | number;
  }, callback?: (window: browser.windows.Window) => void): Promise<browser.windows.Window>;
  export function update(tabId?: number, updateProperties: {
    url?: string;
    active?: boolean;
    highlighted?: boolean;
    selected?: boolean;
    pinned?: boolean;
    muted?: boolean;
    openerTabId?: number;
    autoDiscardable?: boolean;
  }, callback?: (tab?: Tab) => void): Promise<Tab>;
  export function move(tabIds: number | number[], moveProperties: {
    windowId?: number;
    index: number;
  }, callback?: (tabs: Tab | Tab[]) => void): Promise<Tab | Tab[]>;
  export function reload(tabId?: number, reloadProperties?: {
    bypassCache?: boolean;
  }, callback?: () => void): void;
  export function remove(tabIds: number | number[], callback?: () => void): void;
  export function detectLanguage(tabId?: number, callback?: (language: string) => void): Promise<string>;
  export function captureVisibleTab(windowId?: number, options?: browser.extensionTypes.ImageDetails, callback?: (dataUrl: string) => void): Promise<string>;
  export function insertCSS(tabId?: number, details: browser.extensionTypes.InjectDetails, callback?: () => void): void;
  export function discard(tabId?: number, callback?: (tab?: Tab) => void): Promise<Tab>;
  export function goForward(tabId?: number, callback?: () => void): void;
  export function goBack(tabId?: number, callback?: () => void): void;
  export const onCreated: chrome.events.Event<(tab: Tab) => void>;
  export const onUpdated: chrome.events.Event<(tabId: number, changeInfo: {
    status?: TabStatus;
    url?: string;
    pinned?: boolean;
    audible?: boolean;
    discarded?: boolean;
    autoDiscardable?: boolean;
    mutedInfo?: MutedInfo;
    favIconUrl?: string;
    title?: string;
  }, tab: Tab) => void>;
  export const onMoved: chrome.events.Event<(tabId: number, moveInfo: {
    windowId: number;
    fromIndex: number;
    toIndex: number;
  }) => void>;
  export const onSelectionChanged: chrome.events.Event<(tabId: number, selectInfo: {
    windowId: number;
  }) => void>;
  export const onActiveChanged: chrome.events.Event<(tabId: number, selectInfo: {
    windowId: number;
  }) => void>;
  export const onActivated: chrome.events.Event<(activeInfo: {
    tabId: number;
    windowId: number;
  }) => void>;
  export const onHighlightChanged: chrome.events.Event<(selectInfo: {
    windowId: number;
    tabIds: number[];
  }) => void>;
  export const onHighlighted: chrome.events.Event<(highlightInfo: {
    windowId: number;
    tabIds: number[];
  }) => void>;
  export const onDetached: chrome.events.Event<(tabId: number, detachInfo: {
    oldWindowId: number;
    oldPosition: number;
  }) => void>;
  export const onAttached: chrome.events.Event<(tabId: number, attachInfo: {
    newWindowId: number;
    newPosition: number;
  }) => void>;
  export const onRemoved: chrome.events.Event<(tabId: number, removeInfo: {
    windowId: number;
    isWindowClosing: boolean;
  }) => void>;
  export const onReplaced: chrome.events.Event<(addedTabId: number, removedTabId: number) => void>;
}

declare namespace browser.tabsPrivate {
  export function getNavigationState(tabId: number): void;
  export function stop(tabId: number): void;
}

declare namespace browser.webNavigation {
  export function getFrame(details: {
    tabId: number;
    processId?: number;
    frameId: number;
  }, callback?: (details?: {
    errorOccurred: boolean;
    url: string;
    parentFrameId: number;
  }) => void): Promise<{
    errorOccurred: boolean;
    url: string;
    parentFrameId: number;
  }>;
  export function getAllFrames(details: {
    tabId: number;
  }, callback?: (details?: {
    errorOccurred: boolean;
    processId: number;
    frameId: number;
    parentFrameId: number;
    url: string;
  }[]) => void): Promise<{
    errorOccurred: boolean;
    processId: number;
    frameId: number;
    parentFrameId: number;
    url: string;
  }[]>;
  export const onBeforeNavigate: chrome.events.Event<(details: {
    tabId: number;
    url: string;
    processId: number;
    frameId: number;
    parentFrameId: number;
    timeStamp: number;
  }) => void>;
  export const onCommitted: chrome.events.Event<(details: {
    tabId: number;
    url: string;
    processId: number;
    frameId: number;
    parentFrameId: number;
    transitionType: TransitionType;
    transitionQualifiers: TransitionQualifier[];
    timeStamp: number;
  }) => void>;
  export const onDOMContentLoaded: chrome.events.Event<(details: {
    tabId: number;
    url: string;
    processId: number;
    frameId: number;
    parentFrameId: number;
    timeStamp: number;
  }) => void>;
  export const onCompleted: chrome.events.Event<(details: {
    tabId: number;
    url: string;
    processId: number;
    frameId: number;
    parentFrameId: number;
    timeStamp: number;
  }) => void>;
  export const onErrorOccurred: chrome.events.Event<(details: {
    tabId: number;
    url: string;
    processId: number;
    frameId: number;
    parentFrameId: number;
    error: string;
    timeStamp: number;
  }) => void>;
  export const onCreatedNavigationTarget: chrome.events.Event<(details: {
    sourceTabId: number;
    sourceProcessId: number;
    sourceFrameId: number;
    url: string;
    tabId: number;
    timeStamp: number;
  }) => void>;
  export const onReferenceFragmentUpdated: chrome.events.Event<(details: {
    tabId: number;
    url: string;
    processId: number;
    frameId: number;
    parentFrameId: number;
    transitionType: TransitionType;
    transitionQualifiers: TransitionQualifier[];
    timeStamp: number;
  }) => void>;
  export const onTabReplaced: chrome.events.Event<(details: {
    replacedTabId: number;
    tabId: number;
    timeStamp: number;
  }) => void>;
  export const onHistoryStateUpdated: chrome.events.Event<(details: {
    tabId: number;
    url: string;
    processId: number;
    frameId: number;
    parentFrameId: number;
    transitionType: TransitionType;
    transitionQualifiers: TransitionQualifier[];
    timeStamp: number;
  }) => void>;
}

declare namespace browser.webRequest {
  export interface RequestFilter {
    urls: string[];
    types?: ResourceType[];
    tabId?: number;
    windowId?: number;
  }
  export type HttpHeaders = {
    name: string;
    value?: string;
    binaryValue?: number[];
  }[];
  export interface BlockingResponse {
    cancel?: boolean;
    redirectUrl?: string;
    requestHeaders?: HttpHeaders;
    responseHeaders?: HttpHeaders;
    authCredentials?: {
      username: string;
      password: string;
    };
  }
  export interface UploadData {
    bytes?: any;
    file?: string;
  }
  export function handlerBehaviorChanged(callback?: () => void): void;
  export const onBeforeRequest: chrome.events.Event<(details: {
    requestId: string;
    url: string;
    method: string;
    frameId: number;
    parentFrameId: number;
    requestBody?: {
      error?: string;
      formData?: {
      };
      raw?: UploadData[];
    };
    tabId: number;
    type: ResourceType;
    initiator?: string;
    timeStamp: number;
  }) => BlockingResponse>;
  export const onBeforeSendHeaders: chrome.events.Event<(details: {
    requestId: string;
    url: string;
    method: string;
    frameId: number;
    parentFrameId: number;
    tabId: number;
    initiator?: string;
    type: ResourceType;
    timeStamp: number;
    requestHeaders?: HttpHeaders;
  }) => BlockingResponse>;
  export const onSendHeaders: chrome.events.Event<(details: {
    requestId: string;
    url: string;
    method: string;
    frameId: number;
    parentFrameId: number;
    tabId: number;
    initiator?: string;
    type: ResourceType;
    timeStamp: number;
    requestHeaders?: HttpHeaders;
  }) => void>;
  export const onHeadersReceived: chrome.events.Event<(details: {
    requestId: string;
    url: string;
    method: string;
    frameId: number;
    parentFrameId: number;
    tabId: number;
    type: ResourceType;
    initiator?: string;
    timeStamp: number;
    statusLine: string;
    responseHeaders?: HttpHeaders;
    statusCode: number;
  }) => BlockingResponse>;
  export const onAuthRequired: chrome.events.Event<(details: {
    requestId: string;
    url: string;
    method: string;
    frameId: number;
    parentFrameId: number;
    tabId: number;
    type: ResourceType;
    initiator?: string;
    timeStamp: number;
    scheme: string;
    realm?: string;
    challenger: {
      host: string;
      port: number;
    };
    isProxy: boolean;
    responseHeaders?: HttpHeaders;
    statusLine: string;
    statusCode: number;
  }, asyncCallback?: (response: BlockingResponse) => void) => BlockingResponse>;
  export const onResponseStarted: chrome.events.Event<(details: {
    requestId: string;
    url: string;
    method: string;
    frameId: number;
    parentFrameId: number;
    tabId: number;
    type: ResourceType;
    initiator?: string;
    timeStamp: number;
    ip?: string;
    fromCache: boolean;
    statusCode: number;
    responseHeaders?: HttpHeaders;
    statusLine: string;
  }) => void>;
  export const onBeforeRedirect: chrome.events.Event<(details: {
    requestId: string;
    url: string;
    method: string;
    frameId: number;
    parentFrameId: number;
    tabId: number;
    type: ResourceType;
    initiator?: string;
    timeStamp: number;
    ip?: string;
    fromCache: boolean;
    statusCode: number;
    redirectUrl: string;
    responseHeaders?: HttpHeaders;
    statusLine: string;
  }) => void>;
  export const onCompleted: chrome.events.Event<(details: {
    requestId: string;
    url: string;
    method: string;
    frameId: number;
    parentFrameId: number;
    tabId: number;
    type: ResourceType;
    initiator?: string;
    timeStamp: number;
    ip?: string;
    fromCache: boolean;
    statusCode: number;
    responseHeaders?: HttpHeaders;
    statusLine: string;
  }) => void>;
  export const onErrorOccurred: chrome.events.Event<(details: {
    requestId: string;
    url: string;
    method: string;
    frameId: number;
    parentFrameId: number;
    tabId: number;
    type: ResourceType;
    initiator?: string;
    timeStamp: number;
    ip?: string;
    fromCache: boolean;
    error: string;
  }) => void>;
  export const onActionIgnored: chrome.events.Event<(details: {
    requestId: string;
    action: IgnoredActionType;
  }) => void>;
}

declare namespace browser.windows {
  export interface Window {
    id?: number;
    focused: boolean;
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    tabs?: browser.tabs.Tab[];
    incognito: boolean;
    type?: WindowType;
    state?: WindowState;
    alwaysOnTop: boolean;
    sessionId?: string;
  }
  export function get(windowId: number, getInfo?: {
    populate?: boolean;
    windowTypes?: WindowType[];
  }, callback?: (window: Window) => void): Promise<Window>;
  export function getCurrent(getInfo?: {
    populate?: boolean;
    windowTypes?: WindowType[];
  }, callback?: (window: Window) => void): Promise<Window>;
  export function getLastFocused(getInfo?: {
    populate?: boolean;
    windowTypes?: WindowType[];
  }, callback?: (window: Window) => void): Promise<Window>;
  export function getAll(getInfo?: {
    populate?: boolean;
    windowTypes?: WindowType[];
  }, callback?: (windows: Window[]) => void): Promise<Window[]>;
  export function create(createData?: {
    url?: string | string[];
    tabId?: number;
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    focused?: boolean;
    incognito?: boolean;
    type?: CreateType;
    state?: WindowState;
    setSelfAsOpener?: boolean;
  }, callback?: (window?: Window) => void): Promise<Window>;
  export function update(windowId: number, updateInfo: {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    focused?: boolean;
    drawAttention?: boolean;
    state?: WindowState;
  }, callback?: (window: Window) => void): Promise<Window>;
  export function remove(windowId: number, callback?: () => void): void;
  export const onCreated: chrome.events.Event<(window: Window) => void>;
  export const onRemoved: chrome.events.Event<(windowId: number) => void>;
  export const onFocusChanged: chrome.events.Event<(windowId: number) => void>;
}

