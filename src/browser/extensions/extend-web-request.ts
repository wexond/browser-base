import { Session } from 'electron';

import { matchesPattern } from './url-pattern';
import { randomId } from '~/common/utils/string';

type WebRequestWithCallback =
  | 'onBeforeRequest'
  | 'onBeforeSendHeaders'
  | 'onHeadersReceived';

type WebRequestWithoutCallback =
  | 'onSendHeaders'
  | 'onResponseStarted'
  | 'onBeforeRedirect'
  | 'onCompleted'
  | 'onErrorOccurred';

export type WebRequestMethod =
  | WebRequestWithCallback
  | WebRequestWithoutCallback;
export type URLPattern = string;

export interface IFilter {
  urls: string[];
}

export interface IListener {
  id: string;
  urls: string[];
  action: Function;
  context: IContext;
}

export interface IContext {
  priority?: number;
  origin?: string;
  order: number;
}

export interface IApplier {
  apply: Function;
  context: IContext;
}

export interface IAliasParameters {
  unbind: boolean;
  filter: IFilter;
  action: Function | null;
  context: Record<string, any>;
}

export type IListenerCollection = Map<IListener['id'], IListener>;

const defaultResolver = (listeners: IApplier[]) => {
  const response = listeners
    .sort((a, b) => b.context.order - a.context.order)
    .reduce(
      async (accumulator: any, element: any) => {
        if (accumulator.cancel) {
          return accumulator;
        }

        const result = await element.apply();

        return { ...accumulator, ...result };
      },
      { cancel: false },
    );

  return response;
};

const methodsWithCallback = [
  'onBeforeRequest',
  'onBeforeSendHeaders',
  'onHeadersReceived',
];

const aliasMethods = [
  'onBeforeRequest',
  'onBeforeSendHeaders',
  'onHeadersReceived',
  'onSendHeaders',
  'onResponseStarted',
  'onBeforeRedirect',
  'onCompleted',
  'onErrorOccurred',
];

export class BetterWebRequest {
  public webRequest: any;

  private orderIndex: number;
  private listeners: Map<WebRequestMethod, IListenerCollection>;
  private filters: Map<WebRequestMethod, Set<URLPattern>>;
  private resolvers: Map<WebRequestMethod, Function>;

  constructor(webRequest: any) {
    this.orderIndex = 0;
    this.webRequest = webRequest;
    this.listeners = new Map();
    this.filters = new Map();
    this.resolvers = new Map();
  }

  private get nextIndex() {
    return (this.orderIndex += 1);
  }

  getListeners() {
    return this.listeners;
  }

  getListenersFor(method: WebRequestMethod) {
    return this.listeners.get(method);
  }

  getFilters() {
    return this.filters;
  }

  getFiltersFor(method: WebRequestMethod) {
    return this.filters.get(method);
  }

  hasCallback(method: WebRequestMethod): boolean {
    return methodsWithCallback.includes(method);
  }

  alias(method: WebRequestMethod, parameters: any) {
    const args = this.parseArguments(parameters);
    return this.identifyAction(method, args);
  }

  addListener(
    method: WebRequestMethod,
    filter: IFilter,
    action: Function,
    outerContext: Partial<IContext> = {},
  ) {
    const { urls } = filter;
    const id = randomId();
    const innerContext = { order: this.nextIndex };
    const context = { ...outerContext, ...innerContext };
    const listener = {
      id,
      urls,
      action,
      context,
    };

    if (!this.listeners.has(method)) {
      this.listeners.set(method, new Map());
    }

    this.listeners.get(method)!.set(id, listener);

    if (!this.filters.has(method)) {
      this.filters.set(method, new Set());
    }

    const currentFilters = this.filters.get(method)!;
    for (const url of urls) {
      currentFilters.add(url);
    }

    this.webRequest[method](
      { urls: [...currentFilters] },
      this.listenerFactory(method),
    );

    return listener;
  }

  removeListener(method: WebRequestMethod, id: IListener['id']) {
    const listeners = this.listeners.get(method);

    if (!listeners || !listeners.has(id)) {
      return;
    }

    if (listeners.size === 1) {
      this.clearListeners(method);
    } else {
      listeners.delete(id);

      const newFilters = this.mergeFilters(listeners);
      this.filters.set(method, newFilters);

      this.webRequest[method](
        { urls: [...newFilters] },
        this.listenerFactory(method),
      );
    }
  }

  clearListeners(method: WebRequestMethod) {
    const listeners = this.listeners.get(method);
    const filters = this.filters.get(method);

    if (listeners) listeners.clear();
    if (filters) filters.clear();

    this.webRequest[method](null);
  }

  setResolver(method: WebRequestMethod, resolver: Function) {
    if (!this.hasCallback(method)) {
      console.warn(
        `Event method "${method}" has no callback and does not use a resolver`,
      );
      return;
    }

    this.resolvers.set(method, resolver);
  }

  matchListeners(url: string, listeners: IListenerCollection): IListener[] {
    const arrayListeners = Array.from(listeners.values());

    return arrayListeners.filter((element) =>
      element.urls.some((value) => matchesPattern(value, url)),
    );
  }

  private listenerFactory(method: WebRequestMethod) {
    return async (details: any, callback?: Function) => {
      if (!this.listeners.has(method)) {
        this.webRequest[method](null);
        return;
      }

      const listeners = this.listeners.get(method);

      if (!listeners) {
        if (callback) callback({ cancel: false });
        return;
      }

      const matchedListeners = this.matchListeners(details.url, listeners);

      if (matchedListeners.length === 0) {
        if (callback) callback({ cancel: false });
        return;
      }

      let resolve = this.resolvers.get(method);

      if (!resolve) {
        resolve = defaultResolver;
      }

      const requestsProcesses = this.processRequests(details, matchedListeners);

      if (this.hasCallback(method) && callback) {
        const modified = await resolve(requestsProcesses);
        callback(modified);
      } else {
        requestsProcesses.map((listener) => listener.apply());
      }
    };
  }

  private processRequests(
    details: any,
    requestListeners: IListener[],
  ): IApplier[] {
    const appliers: IApplier[] = [];

    for (const listener of requestListeners) {
      const apply = this.makeApplier(details, listener.action);

      appliers.push({
        apply,
        context: listener.context,
      });
    }

    return appliers;
  }

  private makeApplier(details: any, listener: Function): Function {
    return () =>
      new Promise((resolve, reject) => {
        try {
          listener(details, resolve);
        } catch (err) {
          reject(err);
        }
      });
  }

  private mergeFilters(listeners: IListenerCollection): Set<any> {
    const arrayListeners = Array.from(listeners.values());

    return arrayListeners.reduce((accumulator, value) => {
      for (const url of value.urls) accumulator.add(url);
      return accumulator;
    }, new Set());
  }

  private parseArguments(parameters: any): IAliasParameters {
    const args = {
      unbind: false,
      filter: { urls: ['<all_urls>'] },
      action: null as any,
      context: {},
    };

    switch (parameters.length) {
      case 0:
        args.unbind = true;
        break;

      case 1:
        if (typeof parameters[0] === 'function') {
          args.action = parameters[0];
          break;
        }

        throw new Error(
          'Wrong function signature : No function listener given',
        );

      case 2:
        if (
          typeof parameters[0] === 'object' &&
          typeof parameters[1] === 'function'
        ) {
          args.filter = parameters[0];
          args.action = parameters[1];
          break;
        }

        if (typeof parameters[0] === 'function') {
          args.action = parameters[0];
          args.context = parameters[1];
          break;
        }

        throw new Error(
          'Wrong function signature : argument 1 should be an object filters or the function listener',
        );

      case 3:
        if (
          typeof parameters[0] === 'object' &&
          typeof parameters[1] === 'function'
        ) {
          args.filter = parameters[0];
          args.action = parameters[1];
          args.context = parameters[2];
          break;
        }

        throw new Error(
          'Wrong function signature : should be arg 1 -> filter object, arg 2 -> function listener, arg 3 -> context',
        );

      default:
        throw new Error('Wrong function signature : Too many arguments');
    }

    return args;
  }

  private identifyAction(method: WebRequestMethod, args: IAliasParameters) {
    const { unbind, filter, action, context } = args;

    if (unbind) {
      return this.clearListeners(method);
    }

    if (!action) {
      throw new Error(`Cannot bind with ${method} : a listener is missing.`);
    }

    return this.addListener(method, filter, action, context);
  }
}

const aliasHandler = {
  get: (target: BetterWebRequest, property: any) => {
    if (aliasMethods.includes(property)) {
      return (...parameters: any) => {
        target.alias(property, parameters);
      };
    }

    return (target as any)[property];
  },
};

const betterWebRequest = (session: Session) => {
  return new Proxy(new BetterWebRequest(session.webRequest), aliasHandler);
};

const store = new Set();

const extendElectronWebRequest = (session: Session): Session => {
  if (store.has(session)) {
    return session;
  }

  Object.defineProperty(session, 'webRequest', {
    value: betterWebRequest(session),
    writable: false,
  });

  store.add(session);

  return session;
};

export default extendElectronWebRequest;
