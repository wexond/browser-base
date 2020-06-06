const getAPI = (context, processParameters) => {
  const { ipcRenderer } = require('electron');
  const { v4: uuidv4 } = require('uuid');

  const e = (scope, name) => {
    const callbackIdMap = new Map();
    const callbacks = [];

    return {
      addListener: (callback, ...args) => {
        const id = uuidv4();
        callbackIdMap.set(callback, id);
        callbacks.push(callback);

        ipcRenderer.addListener(id, (e, responseId, ...args) => {
          const response = callback(...args);

          if (responseId) {
            ipcRenderer.send(`${id}-${responseId}`, response);
          }
        });

        ipcRenderer.send(`${scope}.addListener`, id, name, ...args);
      },
      removeListener: (callback) => {
        if (!callbackIdMap.has(callback)) {
          return;
        }

        const id = callbackIdMap.get(callback);
        callbackIdMap.delete(callback);

        callbacks.splice(callbacks.indexOf(callback), 1);

        ipcRenderer.removeAllListeners(id);
        ipcRenderer.send(`${scope}.removeListener`, id);
      },
      dispatch: (...args) => {
        for (const cb of callbacks) {
          if (cb) cb(...args);
        }
      },
      hasListener: (callback) => {
        return callbackIdMap.has(callback);
      },
    };
  };

  const getJsType = (chromeType) => {
    if (chromeType === 'integer') return 'number';
    if (chromeType === 'double') return 'number';
    if (chromeType === 'long') return 'number';
    return chromeType;
  };

  const getChromeType = (obj) => {
    if (Array.isArray(obj)) return 'array';
    return typeof obj;
  };

  const i = (scope, name, parameters) => async (...args) => {
    const expectedParams = parameters.map((x) => ({ ...p[x] }));
    const data = {};

    for (const param of expectedParams) {
      if (typeof param.ref !== undefined || typeof param.ref !== null) {
        let ref;

        if (typeof param.ref === 'number') {
          ref = t[scope][param.ref];
        } else if (typeof param.ref === 'object') {
          ref = t[param.ref.n][param.ref.i];
        }

        Object.assign(param, ref);
      }
    }

    let j = 0;

    for (let i = 0; i < expectedParams.length; i++) {
      const expected = expectedParams[i];
      const current = args[j];

      if (
        getChromeType(current) === getJsType(expected.type) ||
        (expected.choices &&
          expected.choices.some(
            (x) => getJsType(x.type) === getChromeType(current),
          ))
      ) {
        data[expected.name] = current;

        j++;
      } else if (!expected.optional && expected.name !== 'callback') {
        throw new Error(
          `Error in invocation of ${scope}.${name}(${expectedParams
            .map(
              (x) =>
                `${x.optional ? 'optional ' : ''}${
                  x.type ||
                  x.choices
                    .map((x) =>
                      x.type === 'array' ? `${x.items.type}[]` : x.type,
                    )
                    .join(' | ')
                } ${x.name}`,
            )
            .join(', ')}): No matching signature.`,
        );
      }
    }

    const result = await processParameters(scope, name, data);

    if (data.callback) {
      data.callback(result);
    } else {
      return result;
    }
  };
  var p = [
    {
      name: 'details',
      type: 'object',
      properties: {
        title: { type: 'string' },
        tabId: { type: 'integer', optional: true },
      },
    },
    { type: 'function', name: 'callback', parameters: [], optional: true },
    {
      name: 'details',
      type: 'object',
      properties: { tabId: { type: 'integer', optional: true } },
    },
    { name: 'result', type: 'string' },
    { type: 'function', name: 'callback', parameters: [3] },
    {
      name: 'details',
      type: 'object',
      properties: {
        imageData: {
          choices: [
            { ref: 1 },
            { type: 'object', additionalProperties: { type: 'any' } },
          ],
          optional: true,
        },
        path: {
          choices: [
            { type: 'string' },
            { type: 'object', additionalProperties: { type: 'any' } },
          ],
          optional: true,
        },
        tabId: { type: 'integer', optional: true },
      },
    },
    {
      name: 'details',
      type: 'object',
      properties: {
        tabId: { type: 'integer', optional: true, minimum: 0 },
        popup: { type: 'string' },
      },
    },
    {
      name: 'details',
      type: 'object',
      properties: {
        text: { type: 'string', optional: true },
        tabId: { type: 'integer', optional: true },
      },
    },
    {
      name: 'details',
      type: 'object',
      properties: {
        color: { choices: [{ type: 'string' }, { ref: 0 }] },
        tabId: { type: 'integer', optional: true },
      },
    },
    { name: 'result', ref: 0 },
    { type: 'function', name: 'callback', parameters: [9] },
    { type: 'integer', optional: true, name: 'tabId', minimum: 0 },
    {
      name: 'popupView',
      type: 'object',
      optional: true,
      additionalProperties: { type: 'any' },
    },
    { type: 'function', name: 'callback', parameters: [12] },
    { name: 'tab', ref: { n: 'tabs', i: 5 } },
    { name: 'tabId', type: 'long' },
    { name: 'extensionId', type: 'string' },
    { name: 'details', ref: 0 },
    { name: 'browserAction', type: 'long' },
    {
      type: 'object',
      name: 'details',
      properties: {
        url: { type: 'string' },
        name: { type: 'string' },
        storeId: { type: 'string', optional: true },
      },
    },
    { name: 'cookie', optional: true, ref: 2 },
    { type: 'function', name: 'callback', parameters: [20] },
    {
      type: 'object',
      name: 'details',
      properties: {
        url: { type: 'string', optional: true },
        name: { type: 'string', optional: true },
        domain: { type: 'string', optional: true },
        path: { type: 'string', optional: true },
        secure: { type: 'boolean', optional: true },
        session: { type: 'boolean', optional: true },
        storeId: { type: 'string', optional: true },
      },
    },
    { name: 'cookies', type: 'array', items: { ref: 2 } },
    { type: 'function', name: 'callback', parameters: [23] },
    {
      type: 'object',
      name: 'details',
      properties: {
        url: { type: 'string' },
        name: { type: 'string', optional: true },
        value: { type: 'string', optional: true },
        domain: { type: 'string', optional: true },
        path: { type: 'string', optional: true },
        secure: { type: 'boolean', optional: true },
        httpOnly: { type: 'boolean', optional: true },
        sameSite: { optional: true, ref: 0 },
        expirationDate: { type: 'number', optional: true },
        storeId: { type: 'string', optional: true },
      },
    },
    {
      type: 'function',
      name: 'callback',
      optional: true,
      min_version: '11.0.674.0',
      parameters: [20],
    },
    {
      name: 'details',
      type: 'object',
      optional: true,
      properties: {
        url: { type: 'string' },
        name: { type: 'string' },
        storeId: { type: 'string' },
      },
    },
    {
      type: 'function',
      name: 'callback',
      optional: true,
      min_version: '11.0.674.0',
      parameters: [27],
    },
    { name: 'cookieStores', type: 'array', items: { ref: 3 } },
    { type: 'function', name: 'callback', parameters: [29] },
    {
      type: 'object',
      name: 'changeInfo',
      properties: {
        removed: { type: 'boolean' },
        cookie: { ref: 2 },
        cause: { min_version: '12.0.707.0', ref: 4 },
      },
    },
    { name: 'name', type: 'string' },
    { name: 'visible', type: 'boolean' },
    { name: 'callback', type: 'function' },
    { nodoc: 'true', name: 'eventName', type: 'string' },
    { name: 'webViewInstanceId', type: 'integer', nodoc: true },
    { name: 'rules', type: 'array', items: { ref: 0 } },
    { name: 'callback', optional: true, type: 'function', parameters: [37] },
    {
      name: 'ruleIdentifiers',
      optional: true,
      type: 'array',
      items: { type: 'string' },
    },
    { name: 'callback', type: 'function', parameters: [37] },
    { type: 'string', name: 'url', maxLength: 255 },
    { name: 'status', ref: 0 },
    {
      name: 'details',
      type: 'object',
      optional: true,
      properties: { version: { type: 'string' } },
    },
    { type: 'function', name: 'callback', parameters: [42, 43] },
    { type: 'integer', name: 'seconds' },
    { type: 'function', name: 'callback', optional: true },
    {
      type: 'object',
      name: 'details',
      properties: {
        reason: { ref: 2 },
        previousVersion: { type: 'string', optional: true },
        id: { type: 'string', optional: true },
      },
    },
    {
      type: 'object',
      name: 'details',
      properties: { version: { type: 'string' } },
      additionalProperties: { type: 'any' },
    },
    { name: 'reason', ref: 4 },
    { type: 'integer', name: 'tabId', minimum: 0 },
    { name: 'tab', ref: 5 },
    { type: 'function', name: 'callback', parameters: [51] },
    { name: 'tab', optional: true, ref: 5 },
    { type: 'function', name: 'callback', parameters: [53] },
    { type: 'integer', name: 'windowId', minimum: -2, optional: true },
    { name: 'tabs', type: 'array', items: { ref: 5 } },
    { type: 'function', name: 'callback', parameters: [56] },
    {
      type: 'object',
      name: 'createProperties',
      properties: {
        windowId: { type: 'integer', minimum: -2, optional: true },
        index: { type: 'integer', minimum: 0, optional: true },
        url: { type: 'string', optional: true },
        active: { type: 'boolean', optional: true },
        selected: { type: 'boolean', optional: true },
        pinned: { type: 'boolean', optional: true },
        openerTabId: { type: 'integer', minimum: 0, optional: true },
      },
    },
    { type: 'function', name: 'callback', optional: true, parameters: [51] },
    { type: 'function', name: 'callback', optional: true, parameters: [53] },
    {
      type: 'object',
      name: 'queryInfo',
      properties: {
        active: { type: 'boolean', optional: true },
        pinned: { type: 'boolean', optional: true },
        audible: { type: 'boolean', optional: true },
        muted: { type: 'boolean', optional: true },
        highlighted: { type: 'boolean', optional: true },
        discarded: { type: 'boolean', optional: true },
        autoDiscardable: { type: 'boolean', optional: true },
        currentWindow: { type: 'boolean', optional: true },
        lastFocusedWindow: { type: 'boolean', optional: true },
        status: { optional: true, ref: 0 },
        title: { type: 'string', optional: true },
        url: {
          choices: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
          optional: true,
        },
        windowId: { type: 'integer', optional: true, minimum: -2 },
        windowType: { optional: true, ref: 11 },
        index: { type: 'integer', optional: true, minimum: 0 },
      },
    },
    { name: 'result', type: 'array', items: { ref: 5 } },
    { type: 'function', name: 'callback', parameters: [62] },
    {
      type: 'object',
      name: 'highlightInfo',
      properties: {
        windowId: { type: 'integer', optional: true, minimum: -2 },
        tabs: {
          choices: [
            { type: 'array', items: { type: 'integer', minimum: 0 } },
            { type: 'integer' },
          ],
        },
      },
    },
    { name: 'window', ref: { n: 'windows', i: 4 } },
    { type: 'function', name: 'callback', optional: true, parameters: [65] },
    {
      type: 'object',
      name: 'updateProperties',
      properties: {
        url: { type: 'string', optional: true },
        active: { type: 'boolean', optional: true },
        highlighted: { type: 'boolean', optional: true },
        selected: { type: 'boolean', optional: true },
        pinned: { type: 'boolean', optional: true },
        muted: { type: 'boolean', optional: true },
        openerTabId: { type: 'integer', minimum: 0, optional: true },
        autoDiscardable: { type: 'boolean', optional: true },
      },
    },
    {
      name: 'tabIds',
      choices: [
        { type: 'integer', minimum: 0 },
        { type: 'array', items: { type: 'integer', minimum: 0 } },
      ],
    },
    {
      type: 'object',
      name: 'moveProperties',
      properties: {
        windowId: { type: 'integer', minimum: -2, optional: true },
        index: { type: 'integer', minimum: -1 },
      },
    },
    {
      name: 'tabs',
      choices: [{ ref: 5 }, { type: 'array', items: { ref: 5 } }],
    },
    { type: 'function', name: 'callback', optional: true, parameters: [70] },
    {
      type: 'object',
      name: 'reloadProperties',
      optional: true,
      properties: { bypassCache: { type: 'boolean', optional: true } },
    },
    { type: 'string', name: 'language' },
    { type: 'function', name: 'callback', parameters: [73] },
    { name: 'options', optional: true, ref: { n: 'extensionTypes', i: 2 } },
    { type: 'string', name: 'dataUrl' },
    { type: 'function', name: 'callback', parameters: [76] },
    { name: 'details', ref: { n: 'extensionTypes', i: 7 } },
    {
      type: 'object',
      name: 'changeInfo',
      properties: {
        status: { optional: true, ref: 0 },
        url: { type: 'string', optional: true },
        pinned: { type: 'boolean', optional: true },
        audible: { type: 'boolean', optional: true },
        discarded: { type: 'boolean', optional: true },
        autoDiscardable: { type: 'boolean', optional: true },
        mutedInfo: { optional: true, ref: 4 },
        favIconUrl: { type: 'string', optional: true },
        title: { type: 'string', optional: true },
      },
    },
    {
      type: 'object',
      name: 'moveInfo',
      properties: {
        windowId: { type: 'integer', minimum: 0 },
        fromIndex: { type: 'integer', minimum: 0 },
        toIndex: { type: 'integer', minimum: 0 },
      },
    },
    {
      type: 'object',
      name: 'selectInfo',
      properties: { windowId: { type: 'integer', minimum: 0 } },
    },
    {
      type: 'object',
      name: 'activeInfo',
      properties: {
        tabId: { type: 'integer', minimum: 0 },
        windowId: { type: 'integer', minimum: 0 },
      },
    },
    {
      type: 'object',
      name: 'selectInfo',
      properties: {
        windowId: { type: 'integer', minimum: 0 },
        tabIds: {
          type: 'array',
          name: 'tabIds',
          items: { type: 'integer', minimum: 0 },
        },
      },
    },
    {
      type: 'object',
      name: 'highlightInfo',
      properties: {
        windowId: { type: 'integer', minimum: 0 },
        tabIds: {
          type: 'array',
          name: 'tabIds',
          items: { type: 'integer', minimum: 0 },
        },
      },
    },
    {
      type: 'object',
      name: 'detachInfo',
      properties: {
        oldWindowId: { type: 'integer', minimum: 0 },
        oldPosition: { type: 'integer', minimum: 0 },
      },
    },
    {
      type: 'object',
      name: 'attachInfo',
      properties: {
        newWindowId: { type: 'integer', minimum: 0 },
        newPosition: { type: 'integer', minimum: 0 },
      },
    },
    {
      type: 'object',
      name: 'removeInfo',
      properties: {
        windowId: { type: 'integer', minimum: 0 },
        isWindowClosing: { type: 'boolean' },
      },
    },
    { type: 'integer', name: 'addedTabId', minimum: 0 },
    { type: 'integer', name: 'removedTabId', minimum: 0 },
    {
      type: 'object',
      name: 'details',
      properties: {
        tabId: { type: 'integer', minimum: 0 },
        processId: { type: 'integer', optional: true },
        frameId: { type: 'integer', minimum: 0 },
      },
    },
    {
      type: 'object',
      name: 'details',
      optional: true,
      properties: {
        errorOccurred: { type: 'boolean' },
        url: { type: 'string' },
        parentFrameId: { type: 'integer' },
      },
    },
    { type: 'function', name: 'callback', parameters: [91] },
    {
      type: 'object',
      name: 'details',
      properties: { tabId: { type: 'integer', minimum: 0 } },
    },
    {
      name: 'details',
      type: 'array',
      optional: true,
      items: {
        type: 'object',
        properties: {
          errorOccurred: { type: 'boolean' },
          processId: { type: 'integer' },
          frameId: { type: 'integer' },
          parentFrameId: { type: 'integer' },
          url: { type: 'string' },
        },
      },
    },
    { type: 'function', name: 'callback', parameters: [94] },
    {
      type: 'object',
      name: 'details',
      properties: {
        tabId: { type: 'integer' },
        url: { type: 'string' },
        processId: { type: 'integer' },
        frameId: { type: 'integer' },
        parentFrameId: { type: 'integer' },
        timeStamp: { type: 'number' },
      },
    },
    {
      type: 'object',
      name: 'details',
      properties: {
        tabId: { type: 'integer' },
        url: { type: 'string' },
        processId: { type: 'integer' },
        frameId: { type: 'integer' },
        parentFrameId: { type: 'integer' },
        transitionType: { ref: 0 },
        transitionQualifiers: { type: 'array', items: { ref: 2 } },
        timeStamp: { type: 'number' },
      },
    },
    {
      type: 'object',
      name: 'details',
      properties: {
        tabId: { type: 'integer' },
        url: { type: 'string' },
        processId: { type: 'integer' },
        frameId: { type: 'integer' },
        parentFrameId: { type: 'integer' },
        error: { type: 'string' },
        timeStamp: { type: 'number' },
      },
    },
    {
      type: 'object',
      name: 'details',
      properties: {
        sourceTabId: { type: 'integer' },
        sourceProcessId: { type: 'integer' },
        sourceFrameId: { type: 'integer' },
        url: { type: 'string' },
        tabId: { type: 'integer' },
        timeStamp: { type: 'number' },
      },
    },
    {
      type: 'object',
      name: 'details',
      properties: {
        replacedTabId: { type: 'integer' },
        tabId: { type: 'integer' },
        timeStamp: { type: 'number' },
      },
    },
    {
      type: 'object',
      name: 'details',
      properties: {
        requestId: { type: 'string' },
        url: { type: 'string' },
        method: { type: 'string' },
        frameId: { type: 'integer' },
        parentFrameId: { type: 'integer' },
        requestBody: {
          type: 'object',
          optional: true,
          properties: {
            error: { type: 'string', optional: true },
            formData: {
              type: 'object',
              optional: true,
              properties: {},
              additionalProperties: { type: 'array', items: { ref: 24 } },
            },
            raw: { type: 'array', optional: true, items: { ref: 23 } },
          },
        },
        tabId: { type: 'integer' },
        type: { ref: 0 },
        initiator: { type: 'string', optional: true },
        timeStamp: { type: 'number' },
      },
    },
    {
      type: 'object',
      name: 'details',
      properties: {
        requestId: { type: 'string' },
        url: { type: 'string' },
        method: { type: 'string' },
        frameId: { type: 'integer' },
        parentFrameId: { type: 'integer' },
        tabId: { type: 'integer' },
        initiator: { type: 'string', optional: true },
        type: { ref: 0 },
        timeStamp: { type: 'number' },
        requestHeaders: { optional: true, ref: 21 },
      },
    },
    {
      type: 'object',
      name: 'details',
      properties: {
        requestId: { type: 'string' },
        url: { type: 'string' },
        method: { type: 'string' },
        frameId: { type: 'integer' },
        parentFrameId: { type: 'integer' },
        tabId: { type: 'integer' },
        type: { ref: 0 },
        initiator: { type: 'string', optional: true },
        timeStamp: { type: 'number' },
        statusLine: { type: 'string' },
        responseHeaders: { optional: true, ref: 21 },
        statusCode: { type: 'integer' },
      },
    },
    {
      type: 'object',
      name: 'details',
      properties: {
        requestId: { type: 'string' },
        url: { type: 'string' },
        method: { type: 'string' },
        frameId: { type: 'integer' },
        parentFrameId: { type: 'integer' },
        tabId: { type: 'integer' },
        type: { ref: 0 },
        initiator: { type: 'string', optional: true },
        timeStamp: { type: 'number' },
        scheme: { type: 'string' },
        realm: { type: 'string', optional: true },
        challenger: {
          type: 'object',
          properties: { host: { type: 'string' }, port: { type: 'integer' } },
        },
        isProxy: { type: 'boolean' },
        responseHeaders: { optional: true, ref: 21 },
        statusLine: { type: 'string' },
        statusCode: { type: 'integer' },
      },
    },
    { name: 'response', ref: 22 },
    {
      type: 'function',
      optional: true,
      name: 'asyncCallback',
      parameters: [105],
    },
    {
      type: 'object',
      name: 'details',
      properties: {
        requestId: { type: 'string' },
        url: { type: 'string' },
        method: { type: 'string' },
        frameId: { type: 'integer' },
        parentFrameId: { type: 'integer' },
        tabId: { type: 'integer' },
        type: { ref: 0 },
        initiator: { type: 'string', optional: true },
        timeStamp: { type: 'number' },
        ip: { type: 'string', optional: true },
        fromCache: { type: 'boolean' },
        statusCode: { type: 'integer' },
        responseHeaders: { optional: true, ref: 21 },
        statusLine: { type: 'string' },
      },
    },
    {
      type: 'object',
      name: 'details',
      properties: {
        requestId: { type: 'string' },
        url: { type: 'string' },
        method: { type: 'string' },
        frameId: { type: 'integer' },
        parentFrameId: { type: 'integer' },
        tabId: { type: 'integer' },
        type: { ref: 0 },
        initiator: { type: 'string', optional: true },
        timeStamp: { type: 'number' },
        ip: { type: 'string', optional: true },
        fromCache: { type: 'boolean' },
        statusCode: { type: 'integer' },
        redirectUrl: { type: 'string' },
        responseHeaders: { optional: true, ref: 21 },
        statusLine: { type: 'string' },
      },
    },
    {
      type: 'object',
      name: 'details',
      properties: {
        requestId: { type: 'string' },
        url: { type: 'string' },
        method: { type: 'string' },
        frameId: { type: 'integer' },
        parentFrameId: { type: 'integer' },
        tabId: { type: 'integer' },
        type: { ref: 0 },
        initiator: { type: 'string', optional: true },
        timeStamp: { type: 'number' },
        ip: { type: 'string', optional: true },
        fromCache: { type: 'boolean' },
        error: { type: 'string' },
      },
    },
    {
      type: 'object',
      name: 'details',
      properties: { requestId: { type: 'string' }, action: { ref: 25 } },
    },
    { type: 'integer', name: 'windowId', minimum: -2 },
    {
      type: 'object',
      name: 'getInfo',
      optional: true,
      properties: {
        populate: { type: 'boolean', optional: true },
        windowTypes: { type: 'array', items: { ref: 0 }, optional: true },
      },
    },
    { name: 'window', ref: 4 },
    { type: 'function', name: 'callback', parameters: [113] },
    { name: 'windows', type: 'array', items: { ref: 4 } },
    { type: 'function', name: 'callback', parameters: [115] },
    {
      type: 'object',
      name: 'createData',
      properties: {
        url: {
          optional: true,
          choices: [
            { type: 'string' },
            { type: 'array', items: { type: 'string' } },
          ],
        },
        tabId: { type: 'integer', minimum: 0, optional: true },
        left: { type: 'integer', optional: true },
        top: { type: 'integer', optional: true },
        width: { type: 'integer', minimum: 0, optional: true },
        height: { type: 'integer', minimum: 0, optional: true },
        focused: { type: 'boolean', optional: true },
        incognito: { type: 'boolean', optional: true },
        type: { optional: true, ref: 5 },
        state: { optional: true, ref: 2 },
        setSelfAsOpener: { type: 'boolean', optional: true },
      },
      optional: true,
    },
    { name: 'window', optional: true, ref: 4 },
    { type: 'function', name: 'callback', optional: true, parameters: [118] },
    {
      type: 'object',
      name: 'updateInfo',
      properties: {
        left: { type: 'integer', optional: true },
        top: { type: 'integer', optional: true },
        width: { type: 'integer', minimum: 0, optional: true },
        height: { type: 'integer', minimum: 0, optional: true },
        focused: { type: 'boolean', optional: true },
        drawAttention: { type: 'boolean', optional: true },
        state: { optional: true, ref: 2 },
      },
    },
    { type: 'function', name: 'callback', optional: true, parameters: [113] },
    { type: 'integer', name: 'windowId', minimum: 0 },
    { type: 'integer', name: 'windowId', minimum: -1 },
  ];
  var t = {
    browserAction: [
      {
        id: 'ColorArray',
        type: 'array',
        items: { type: 'integer', minimum: 0, maximum: 255 },
        minItems: 4,
        maxItems: 4,
      },
      {
        id: 'ImageDataType',
        type: 'object',
        isInstanceOf: 'ImageData',
        additionalProperties: { type: 'any' },
      },
    ],
    browserActionPrivate: [
      {
        id: 'OpenPopupDetails',
        type: 'object',
        properties: {
          left: { name: 'left', optional: true, type: 'double' },
          top: { name: 'top', optional: true, type: 'double' },
          inspect: { name: 'inspect', optional: true, type: 'boolean' },
        },
      },
    ],
    cookies: [
      {
        id: 'SameSiteStatus',
        type: 'string',
        enum: ['no_restriction', 'lax', 'strict', 'unspecified'],
      },
      {
        id: 'SameSiteStatus',
        type: 'string',
        enum: ['no_restriction', 'lax', 'strict', 'unspecified'],
      },
      {
        id: 'Cookie',
        type: 'object',
        properties: {
          name: { type: 'string' },
          value: { type: 'string' },
          domain: { type: 'string' },
          hostOnly: { type: 'boolean' },
          path: { type: 'string' },
          secure: { type: 'boolean' },
          httpOnly: { type: 'boolean' },
          sameSite: { ref: 0 },
          session: { type: 'boolean' },
          expirationDate: { type: 'number', optional: true },
          storeId: { type: 'string' },
        },
      },
      {
        id: 'CookieStore',
        type: 'object',
        properties: {
          id: { type: 'string' },
          tabIds: { type: 'array', items: { type: 'integer' } },
        },
      },
      {
        id: 'OnChangedCause',
        type: 'string',
        enum: [
          'evicted',
          'expired',
          'explicit',
          'expired_overwrite',
          'overwrite',
        ],
      },
      {
        id: 'OnChangedCause',
        type: 'string',
        enum: [
          'evicted',
          'expired',
          'explicit',
          'expired_overwrite',
          'overwrite',
        ],
      },
    ],
    dialogsPrivate: [],
    events: [
      {
        id: 'Rule',
        type: 'object',
        properties: {
          id: { type: 'string', optional: true },
          tags: { type: 'array', items: { type: 'string' }, optional: true },
          conditions: { type: 'array', items: { type: 'any' } },
          actions: { type: 'array', items: { type: 'any' } },
          priority: { type: 'integer', optional: true },
        },
      },
      {
        id: 'Event',
        type: 'object',
        additionalProperties: { type: 'any' },
        functions: [
          {
            name: 'addListener',
            nocompile: true,
            type: 'function',
            parameters: [34],
          },
          {
            name: 'removeListener',
            nocompile: true,
            type: 'function',
            parameters: [34],
          },
          {
            name: 'hasListener',
            nocompile: true,
            type: 'function',
            parameters: [34],
            returns: { type: 'boolean' },
          },
          {
            name: 'hasListeners',
            nocompile: true,
            type: 'function',
            parameters: [],
            returns: { type: 'boolean' },
          },
          { name: 'addRules', type: 'function', parameters: [35, 36, 37, 38] },
          { name: 'getRules', type: 'function', parameters: [35, 36, 39, 40] },
          {
            name: 'removeRules',
            type: 'function',
            parameters: [35, 36, 39, 1],
          },
        ],
      },
      {
        id: 'UrlFilter',
        type: 'object',
        nocompile: true,
        properties: {
          hostContains: { type: 'string', optional: true },
          hostEquals: { type: 'string', optional: true },
          hostPrefix: { type: 'string', optional: true },
          hostSuffix: { type: 'string', optional: true },
          pathContains: { type: 'string', optional: true },
          pathEquals: { type: 'string', optional: true },
          pathPrefix: { type: 'string', optional: true },
          pathSuffix: { type: 'string', optional: true },
          queryContains: { type: 'string', optional: true },
          queryEquals: { type: 'string', optional: true },
          queryPrefix: { type: 'string', optional: true },
          querySuffix: { type: 'string', optional: true },
          urlContains: { type: 'string', optional: true },
          urlEquals: { type: 'string', optional: true },
          urlMatches: { type: 'string', optional: true },
          originAndPathMatches: { type: 'string', optional: true },
          urlPrefix: { type: 'string', optional: true },
          urlSuffix: { type: 'string', optional: true },
          schemes: { type: 'array', optional: true, items: { type: 'string' } },
          ports: {
            type: 'array',
            optional: true,
            items: {
              choices: [
                { type: 'integer' },
                { type: 'array', items: { type: 'integer' } },
              ],
            },
          },
        },
      },
    ],
    extensionTypes: [
      { id: 'ImageFormat', type: 'string', enum: ['jpeg', 'png'] },
      { id: 'ImageFormat', type: 'string', enum: ['jpeg', 'png'] },
      {
        id: 'ImageDetails',
        type: 'object',
        properties: {
          format: { optional: true, ref: 0 },
          quality: {
            type: 'integer',
            optional: true,
            minimum: 0,
            maximum: 100,
          },
        },
      },
      {
        id: 'RunAt',
        type: 'string',
        enum: ['document_start', 'document_end', 'document_idle'],
      },
      {
        id: 'RunAt',
        type: 'string',
        enum: ['document_start', 'document_end', 'document_idle'],
      },
      { id: 'CSSOrigin', type: 'string', enum: ['author', 'user'] },
      { id: 'CSSOrigin', type: 'string', enum: ['author', 'user'] },
      {
        id: 'InjectDetails',
        type: 'object',
        properties: {
          code: { type: 'string', optional: true },
          file: { type: 'string', optional: true },
          allFrames: { type: 'boolean', optional: true },
          frameId: { type: 'integer', optional: true, minimum: 0 },
          matchAboutBlank: { type: 'boolean', optional: true },
          runAt: { optional: true, ref: 3 },
          cssOrigin: { optional: true, ref: 5 },
        },
      },
    ],
    runtime: [
      {
        id: 'RequestUpdateCheckStatus',
        type: 'string',
        enum: ['throttled', 'no_update', 'update_available'],
      },
      {
        id: 'RequestUpdateCheckStatus',
        type: 'string',
        enum: ['throttled', 'no_update', 'update_available'],
      },
      {
        id: 'OnInstalledReason',
        type: 'string',
        enum: ['install', 'update', 'chrome_update', 'shared_module_update'],
      },
      {
        id: 'OnInstalledReason',
        type: 'string',
        enum: ['install', 'update', 'chrome_update', 'shared_module_update'],
      },
      {
        id: 'OnRestartRequiredReason',
        type: 'string',
        enum: ['app_update', 'os_update', 'periodic'],
      },
      {
        id: 'OnRestartRequiredReason',
        type: 'string',
        enum: ['app_update', 'os_update', 'periodic'],
      },
    ],
    tabs: [
      {
        id: 'TabStatus',
        type: 'string',
        enum: ['unloaded', 'loading', 'complete'],
      },
      {
        id: 'TabStatus',
        type: 'string',
        enum: ['unloaded', 'loading', 'complete'],
      },
      {
        id: 'MutedInfoReason',
        type: 'string',
        enum: ['user', 'capture', 'extension'],
      },
      {
        id: 'MutedInfoReason',
        type: 'string',
        enum: ['user', 'capture', 'extension'],
      },
      {
        id: 'MutedInfo',
        type: 'object',
        properties: {
          muted: { type: 'boolean' },
          reason: { optional: true, ref: 2 },
          extensionId: { type: 'string', optional: true },
        },
      },
      {
        id: 'Tab',
        type: 'object',
        properties: {
          id: { type: 'integer', minimum: -1, optional: true },
          index: { type: 'integer', minimum: -1 },
          windowId: { type: 'integer', minimum: 0 },
          openerTabId: { type: 'integer', minimum: 0, optional: true },
          selected: { type: 'boolean' },
          highlighted: { type: 'boolean' },
          active: { type: 'boolean' },
          pinned: { type: 'boolean' },
          audible: { type: 'boolean', optional: true },
          discarded: { type: 'boolean' },
          autoDiscardable: { type: 'boolean' },
          mutedInfo: { optional: true, ref: 4 },
          url: { type: 'string', optional: true },
          pendingUrl: { type: 'string', optional: true },
          title: { type: 'string', optional: true },
          favIconUrl: { type: 'string', optional: true },
          status: { optional: true, ref: 0 },
          incognito: { type: 'boolean' },
          width: { type: 'integer', optional: true },
          height: { type: 'integer', optional: true },
          sessionId: { type: 'string', optional: true },
        },
      },
      {
        id: 'ZoomSettingsMode',
        type: 'string',
        enum: ['automatic', 'manual', 'disabled'],
      },
      {
        id: 'ZoomSettingsMode',
        type: 'string',
        enum: ['automatic', 'manual', 'disabled'],
      },
      {
        id: 'ZoomSettingsScope',
        type: 'string',
        enum: ['per-origin', 'per-tab'],
      },
      {
        id: 'ZoomSettingsScope',
        type: 'string',
        enum: ['per-origin', 'per-tab'],
      },
      {
        id: 'ZoomSettings',
        type: 'object',
        properties: {
          mode: { optional: true, ref: 6 },
          scope: { optional: true, ref: 8 },
          defaultZoomFactor: { type: 'number', optional: true },
        },
      },
      {
        id: 'WindowType',
        type: 'string',
        enum: ['normal', 'popup', 'panel', 'app', 'devtools'],
      },
      {
        id: 'WindowType',
        type: 'string',
        enum: ['normal', 'popup', 'panel', 'app', 'devtools'],
      },
    ],
    tabsPrivate: [],
    webNavigation: [
      {
        id: 'TransitionType',
        type: 'string',
        enum: [
          'link',
          'typed',
          'auto_bookmark',
          'auto_subframe',
          'manual_subframe',
          'generated',
          'start_page',
          'form_submit',
          'reload',
          'keyword',
          'keyword_generated',
        ],
      },
      {
        id: 'TransitionType',
        type: 'string',
        enum: [
          'link',
          'typed',
          'auto_bookmark',
          'auto_subframe',
          'manual_subframe',
          'generated',
          'start_page',
          'form_submit',
          'reload',
          'keyword',
          'keyword_generated',
        ],
      },
      {
        id: 'TransitionQualifier',
        type: 'string',
        enum: [
          'client_redirect',
          'server_redirect',
          'forward_back',
          'from_address_bar',
        ],
      },
      {
        id: 'TransitionQualifier',
        type: 'string',
        enum: [
          'client_redirect',
          'server_redirect',
          'forward_back',
          'from_address_bar',
        ],
      },
    ],
    webRequest: [
      {
        id: 'ResourceType',
        type: 'string',
        enum: [
          'main_frame',
          'sub_frame',
          'stylesheet',
          'script',
          'image',
          'font',
          'object',
          'xmlhttprequest',
          'ping',
          'csp_report',
          'media',
          'websocket',
          'other',
        ],
      },
      {
        id: 'ResourceType',
        type: 'string',
        enum: [
          'main_frame',
          'sub_frame',
          'stylesheet',
          'script',
          'image',
          'font',
          'object',
          'xmlhttprequest',
          'ping',
          'csp_report',
          'media',
          'websocket',
          'other',
        ],
      },
      {
        id: 'OnBeforeRequestOptions',
        type: 'string',
        enum: ['blocking', 'requestBody', 'extraHeaders'],
      },
      {
        id: 'OnBeforeRequestOptions',
        type: 'string',
        enum: ['blocking', 'requestBody', 'extraHeaders'],
      },
      {
        id: 'OnBeforeSendHeadersOptions',
        type: 'string',
        enum: ['requestHeaders', 'blocking', 'extraHeaders'],
      },
      {
        id: 'OnBeforeSendHeadersOptions',
        type: 'string',
        enum: ['requestHeaders', 'blocking', 'extraHeaders'],
      },
      {
        id: 'OnSendHeadersOptions',
        type: 'string',
        enum: ['requestHeaders', 'extraHeaders'],
      },
      {
        id: 'OnSendHeadersOptions',
        type: 'string',
        enum: ['requestHeaders', 'extraHeaders'],
      },
      {
        id: 'OnHeadersReceivedOptions',
        type: 'string',
        enum: ['blocking', 'responseHeaders', 'extraHeaders'],
      },
      {
        id: 'OnHeadersReceivedOptions',
        type: 'string',
        enum: ['blocking', 'responseHeaders', 'extraHeaders'],
      },
      {
        id: 'OnAuthRequiredOptions',
        type: 'string',
        enum: ['responseHeaders', 'blocking', 'asyncBlocking', 'extraHeaders'],
      },
      {
        id: 'OnAuthRequiredOptions',
        type: 'string',
        enum: ['responseHeaders', 'blocking', 'asyncBlocking', 'extraHeaders'],
      },
      {
        id: 'OnResponseStartedOptions',
        type: 'string',
        enum: ['responseHeaders', 'extraHeaders'],
      },
      {
        id: 'OnResponseStartedOptions',
        type: 'string',
        enum: ['responseHeaders', 'extraHeaders'],
      },
      {
        id: 'OnBeforeRedirectOptions',
        type: 'string',
        enum: ['responseHeaders', 'extraHeaders'],
      },
      {
        id: 'OnBeforeRedirectOptions',
        type: 'string',
        enum: ['responseHeaders', 'extraHeaders'],
      },
      {
        id: 'OnCompletedOptions',
        type: 'string',
        enum: ['responseHeaders', 'extraHeaders'],
      },
      {
        id: 'OnCompletedOptions',
        type: 'string',
        enum: ['responseHeaders', 'extraHeaders'],
      },
      { id: 'OnErrorOccurredOptions', type: 'string', enum: ['extraHeaders'] },
      { id: 'OnErrorOccurredOptions', type: 'string', enum: ['extraHeaders'] },
      {
        id: 'RequestFilter',
        type: 'object',
        properties: {
          urls: { type: 'array', items: { type: 'string' } },
          types: { type: 'array', optional: true, items: { ref: 0 } },
          tabId: { type: 'integer', optional: true },
          windowId: { type: 'integer', optional: true },
        },
      },
      {
        id: 'HttpHeaders',
        nocompile: true,
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            value: { type: 'string', optional: true },
            binaryValue: {
              type: 'array',
              optional: true,
              items: { type: 'integer' },
            },
          },
        },
      },
      {
        id: 'BlockingResponse',
        nocompile: true,
        type: 'object',
        properties: {
          cancel: { type: 'boolean', optional: true },
          redirectUrl: { type: 'string', optional: true },
          requestHeaders: { optional: true, ref: 21 },
          responseHeaders: { optional: true, ref: 21 },
          authCredentials: {
            type: 'object',
            optional: true,
            properties: {
              username: { type: 'string' },
              password: { type: 'string' },
            },
          },
        },
      },
      {
        id: 'UploadData',
        type: 'object',
        properties: {
          bytes: { type: 'any', optional: true },
          file: { type: 'string', optional: true },
        },
      },
      { id: 'FormDataItem', choices: [{ type: 'binary' }, { type: 'string' }] },
      {
        id: 'IgnoredActionType',
        decription: 'Denotes the extension proposed action which was ignored.',
        type: 'string',
        enum: [
          'redirect',
          'request_headers',
          'response_headers',
          'auth_credentials',
        ],
      },
      {
        id: 'IgnoredActionType',
        decription: 'Denotes the extension proposed action which was ignored.',
        type: 'string',
        enum: [
          'redirect',
          'request_headers',
          'response_headers',
          'auth_credentials',
        ],
      },
    ],
    windows: [
      {
        id: 'WindowType',
        type: 'string',
        enum: ['normal', 'popup', 'panel', 'app', 'devtools'],
      },
      {
        id: 'WindowType',
        type: 'string',
        enum: ['normal', 'popup', 'panel', 'app', 'devtools'],
      },
      {
        id: 'WindowState',
        type: 'string',
        enum: [
          'normal',
          'minimized',
          'maximized',
          'fullscreen',
          'locked-fullscreen',
        ],
      },
      {
        id: 'WindowState',
        type: 'string',
        enum: [
          'normal',
          'minimized',
          'maximized',
          'fullscreen',
          'locked-fullscreen',
        ],
      },
      {
        id: 'Window',
        type: 'object',
        properties: {
          id: { type: 'integer', optional: true, minimum: 0 },
          focused: { type: 'boolean' },
          top: { type: 'integer', optional: true },
          left: { type: 'integer', optional: true },
          width: { type: 'integer', optional: true },
          height: { type: 'integer', optional: true },
          tabs: {
            type: 'array',
            items: { ref: { n: 'tabs', i: 5 } },
            optional: true,
          },
          incognito: { type: 'boolean' },
          type: { optional: true, ref: 0 },
          state: { optional: true, ref: 2 },
          alwaysOnTop: { type: 'boolean' },
          sessionId: { type: 'string', optional: true },
        },
      },
      { id: 'CreateType', type: 'string', enum: ['normal', 'popup', 'panel'] },
      { id: 'CreateType', type: 'string', enum: ['normal', 'popup', 'panel'] },
    ],
  };
  var api = {
    browserAction: {
      setTitle: i('browserAction', 'setTitle', [0, 1]),
      getTitle: i('browserAction', 'getTitle', [2, 4]),
      setIcon: i('browserAction', 'setIcon', [5, 1]),
      setPopup: i('browserAction', 'setPopup', [6, 1]),
      getPopup: i('browserAction', 'getPopup', [2, 4]),
      setBadgeText: i('browserAction', 'setBadgeText', [7, 1]),
      getBadgeText: i('browserAction', 'getBadgeText', [2, 4]),
      setBadgeBackgroundColor: i('browserAction', 'setBadgeBackgroundColor', [
        8,
        1,
      ]),
      getBadgeBackgroundColor: i('browserAction', 'getBadgeBackgroundColor', [
        2,
        10,
      ]),
      enable: i('browserAction', 'enable', [11, 1]),
      disable: i('browserAction', 'disable', [11, 1]),
      openPopup: i('browserAction', 'openPopup', [13]),
      onClicked: e('browserAction', 'onClicked'),
    },
    browserActionPrivate: {
      getAll: i('browserActionPrivate', 'getAll', []),
      getAllInTab: i('browserActionPrivate', 'getAllInTab', [15]),
      openPopup: i('browserActionPrivate', 'openPopup', [16, 17]),
      onUpdated: e('browserActionPrivate', 'onUpdated'),
    },
    cookies: {
      SameSiteStatus: {
        NO_RESTRICTION: 'no_restriction',
        LAX: 'lax',
        STRICT: 'strict',
        UNSPECIFIED: 'unspecified',
      },
      SameSiteStatus: {
        NO_RESTRICTION: 'no_restriction',
        LAX: 'lax',
        STRICT: 'strict',
        UNSPECIFIED: 'unspecified',
      },
      OnChangedCause: {
        EVICTED: 'evicted',
        EXPIRED: 'expired',
        EXPLICIT: 'explicit',
        EXPIRED_OVERWRITE: 'expired_overwrite',
        OVERWRITE: 'overwrite',
      },
      OnChangedCause: {
        EVICTED: 'evicted',
        EXPIRED: 'expired',
        EXPLICIT: 'explicit',
        EXPIRED_OVERWRITE: 'expired_overwrite',
        OVERWRITE: 'overwrite',
      },
      get: i('cookies', 'get', [19, 21]),
      getAll: i('cookies', 'getAll', [22, 24]),
      set: i('cookies', 'set', [25, 26]),
      remove: i('cookies', 'remove', [19, 28]),
      getAllCookieStores: i('cookies', 'getAllCookieStores', [30]),
      onChanged: e('cookies', 'onChanged'),
    },
    dialogsPrivate: {
      onVisibilityStateChange: e('dialogsPrivate', 'onVisibilityStateChange'),
    },
    events: {},
    extensionTypes: {
      ImageFormat: { JPEG: 'jpeg', PNG: 'png' },
      ImageFormat: { JPEG: 'jpeg', PNG: 'png' },
      RunAt: {
        DOCUMENT_START: 'document_start',
        DOCUMENT_END: 'document_end',
        DOCUMENT_IDLE: 'document_idle',
      },
      RunAt: {
        DOCUMENT_START: 'document_start',
        DOCUMENT_END: 'document_end',
        DOCUMENT_IDLE: 'document_idle',
      },
      CSSOrigin: { AUTHOR: 'author', USER: 'user' },
      CSSOrigin: { AUTHOR: 'author', USER: 'user' },
    },
    runtime: {
      RequestUpdateCheckStatus: {
        THROTTLED: 'throttled',
        NO_UPDATE: 'no_update',
        UPDATE_AVAILABLE: 'update_available',
      },
      RequestUpdateCheckStatus: {
        THROTTLED: 'throttled',
        NO_UPDATE: 'no_update',
        UPDATE_AVAILABLE: 'update_available',
      },
      OnInstalledReason: {
        INSTALL: 'install',
        UPDATE: 'update',
        CHROME_UPDATE: 'chrome_update',
        SHARED_MODULE_UPDATE: 'shared_module_update',
      },
      OnInstalledReason: {
        INSTALL: 'install',
        UPDATE: 'update',
        CHROME_UPDATE: 'chrome_update',
        SHARED_MODULE_UPDATE: 'shared_module_update',
      },
      OnRestartRequiredReason: {
        APP_UPDATE: 'app_update',
        OS_UPDATE: 'os_update',
        PERIODIC: 'periodic',
      },
      OnRestartRequiredReason: {
        APP_UPDATE: 'app_update',
        OS_UPDATE: 'os_update',
        PERIODIC: 'periodic',
      },
      openOptionsPage: i('runtime', 'openOptionsPage', [1]),
      setUninstallURL: i('runtime', 'setUninstallURL', [41, 1]),
      requestUpdateCheck: i('runtime', 'requestUpdateCheck', [44]),
      restart: i('runtime', 'restart', []),
      restartAfterDelay: i('runtime', 'restartAfterDelay', [45, 46]),
      onStartup: e('runtime', 'onStartup'),
      onInstalled: e('runtime', 'onInstalled'),
      onSuspend: e('runtime', 'onSuspend'),
      onSuspendCanceled: e('runtime', 'onSuspendCanceled'),
      onUpdateAvailable: e('runtime', 'onUpdateAvailable'),
      onBrowserUpdateAvailable: e('runtime', 'onBrowserUpdateAvailable'),
      onRestartRequired: e('runtime', 'onRestartRequired'),
    },
    tabs: {
      TabStatus: {
        UNLOADED: 'unloaded',
        LOADING: 'loading',
        COMPLETE: 'complete',
      },
      TabStatus: {
        UNLOADED: 'unloaded',
        LOADING: 'loading',
        COMPLETE: 'complete',
      },
      MutedInfoReason: {
        USER: 'user',
        CAPTURE: 'capture',
        EXTENSION: 'extension',
      },
      MutedInfoReason: {
        USER: 'user',
        CAPTURE: 'capture',
        EXTENSION: 'extension',
      },
      ZoomSettingsMode: {
        AUTOMATIC: 'automatic',
        MANUAL: 'manual',
        DISABLED: 'disabled',
      },
      ZoomSettingsMode: {
        AUTOMATIC: 'automatic',
        MANUAL: 'manual',
        DISABLED: 'disabled',
      },
      ZoomSettingsScope: { PER_ORIGIN: 'per-origin', PER_TAB: 'per-tab' },
      ZoomSettingsScope: { PER_ORIGIN: 'per-origin', PER_TAB: 'per-tab' },
      WindowType: {
        NORMAL: 'normal',
        POPUP: 'popup',
        PANEL: 'panel',
        APP: 'app',
        DEVTOOLS: 'devtools',
      },
      WindowType: {
        NORMAL: 'normal',
        POPUP: 'popup',
        PANEL: 'panel',
        APP: 'app',
        DEVTOOLS: 'devtools',
      },
      get: i('tabs', 'get', [50, 52]),
      getCurrent: i('tabs', 'getCurrent', [54]),
      getSelected: i('tabs', 'getSelected', [55, 52]),
      getAllInWindow: i('tabs', 'getAllInWindow', [55, 57]),
      create: i('tabs', 'create', [58, 59]),
      duplicate: i('tabs', 'duplicate', [50, 60]),
      query: i('tabs', 'query', [61, 63]),
      highlight: i('tabs', 'highlight', [64, 66]),
      update: i('tabs', 'update', [11, 67, 60]),
      move: i('tabs', 'move', [68, 69, 71]),
      reload: i('tabs', 'reload', [11, 72, 1]),
      remove: i('tabs', 'remove', [68, 1]),
      detectLanguage: i('tabs', 'detectLanguage', [11, 74]),
      captureVisibleTab: i('tabs', 'captureVisibleTab', [55, 75, 77]),
      insertCSS: i('tabs', 'insertCSS', [11, 78, 1]),
      discard: i('tabs', 'discard', [11, 60]),
      goForward: i('tabs', 'goForward', [11, 1]),
      goBack: i('tabs', 'goBack', [11, 1]),
      onCreated: e('tabs', 'onCreated'),
      onUpdated: e('tabs', 'onUpdated'),
      onMoved: e('tabs', 'onMoved'),
      onSelectionChanged: e('tabs', 'onSelectionChanged'),
      onActiveChanged: e('tabs', 'onActiveChanged'),
      onActivated: e('tabs', 'onActivated'),
      onHighlightChanged: e('tabs', 'onHighlightChanged'),
      onHighlighted: e('tabs', 'onHighlighted'),
      onDetached: e('tabs', 'onDetached'),
      onAttached: e('tabs', 'onAttached'),
      onRemoved: e('tabs', 'onRemoved'),
      onReplaced: e('tabs', 'onReplaced'),
    },
    tabsPrivate: {
      getNavigationState: i('tabsPrivate', 'getNavigationState', [15]),
      stop: i('tabsPrivate', 'stop', [15]),
    },
    webNavigation: {
      TransitionType: {
        LINK: 'link',
        TYPED: 'typed',
        AUTO_BOOKMARK: 'auto_bookmark',
        AUTO_SUBFRAME: 'auto_subframe',
        MANUAL_SUBFRAME: 'manual_subframe',
        GENERATED: 'generated',
        START_PAGE: 'start_page',
        FORM_SUBMIT: 'form_submit',
        RELOAD: 'reload',
        KEYWORD: 'keyword',
        KEYWORD_GENERATED: 'keyword_generated',
      },
      TransitionType: {
        LINK: 'link',
        TYPED: 'typed',
        AUTO_BOOKMARK: 'auto_bookmark',
        AUTO_SUBFRAME: 'auto_subframe',
        MANUAL_SUBFRAME: 'manual_subframe',
        GENERATED: 'generated',
        START_PAGE: 'start_page',
        FORM_SUBMIT: 'form_submit',
        RELOAD: 'reload',
        KEYWORD: 'keyword',
        KEYWORD_GENERATED: 'keyword_generated',
      },
      TransitionQualifier: {
        CLIENT_REDIRECT: 'client_redirect',
        SERVER_REDIRECT: 'server_redirect',
        FORWARD_BACK: 'forward_back',
        FROM_ADDRESS_BAR: 'from_address_bar',
      },
      TransitionQualifier: {
        CLIENT_REDIRECT: 'client_redirect',
        SERVER_REDIRECT: 'server_redirect',
        FORWARD_BACK: 'forward_back',
        FROM_ADDRESS_BAR: 'from_address_bar',
      },
      getFrame: i('webNavigation', 'getFrame', [90, 92]),
      getAllFrames: i('webNavigation', 'getAllFrames', [93, 95]),
      onBeforeNavigate: e('webNavigation', 'onBeforeNavigate'),
      onCommitted: e('webNavigation', 'onCommitted'),
      onDOMContentLoaded: e('webNavigation', 'onDOMContentLoaded'),
      onCompleted: e('webNavigation', 'onCompleted'),
      onErrorOccurred: e('webNavigation', 'onErrorOccurred'),
      onCreatedNavigationTarget: e(
        'webNavigation',
        'onCreatedNavigationTarget',
      ),
      onReferenceFragmentUpdated: e(
        'webNavigation',
        'onReferenceFragmentUpdated',
      ),
      onTabReplaced: e('webNavigation', 'onTabReplaced'),
      onHistoryStateUpdated: e('webNavigation', 'onHistoryStateUpdated'),
    },
    webRequest: {
      ResourceType: {
        MAIN_FRAME: 'main_frame',
        SUB_FRAME: 'sub_frame',
        STYLESHEET: 'stylesheet',
        SCRIPT: 'script',
        IMAGE: 'image',
        FONT: 'font',
        OBJECT: 'object',
        XMLHTTPREQUEST: 'xmlhttprequest',
        PING: 'ping',
        CSP_REPORT: 'csp_report',
        MEDIA: 'media',
        WEBSOCKET: 'websocket',
        OTHER: 'other',
      },
      ResourceType: {
        MAIN_FRAME: 'main_frame',
        SUB_FRAME: 'sub_frame',
        STYLESHEET: 'stylesheet',
        SCRIPT: 'script',
        IMAGE: 'image',
        FONT: 'font',
        OBJECT: 'object',
        XMLHTTPREQUEST: 'xmlhttprequest',
        PING: 'ping',
        CSP_REPORT: 'csp_report',
        MEDIA: 'media',
        WEBSOCKET: 'websocket',
        OTHER: 'other',
      },
      OnBeforeRequestOptions: {
        BLOCKING: 'blocking',
        REQUESTBODY: 'requestBody',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnBeforeRequestOptions: {
        BLOCKING: 'blocking',
        REQUESTBODY: 'requestBody',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnBeforeSendHeadersOptions: {
        REQUESTHEADERS: 'requestHeaders',
        BLOCKING: 'blocking',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnBeforeSendHeadersOptions: {
        REQUESTHEADERS: 'requestHeaders',
        BLOCKING: 'blocking',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnSendHeadersOptions: {
        REQUESTHEADERS: 'requestHeaders',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnSendHeadersOptions: {
        REQUESTHEADERS: 'requestHeaders',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnHeadersReceivedOptions: {
        BLOCKING: 'blocking',
        RESPONSEHEADERS: 'responseHeaders',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnHeadersReceivedOptions: {
        BLOCKING: 'blocking',
        RESPONSEHEADERS: 'responseHeaders',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnAuthRequiredOptions: {
        RESPONSEHEADERS: 'responseHeaders',
        BLOCKING: 'blocking',
        ASYNCBLOCKING: 'asyncBlocking',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnAuthRequiredOptions: {
        RESPONSEHEADERS: 'responseHeaders',
        BLOCKING: 'blocking',
        ASYNCBLOCKING: 'asyncBlocking',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnResponseStartedOptions: {
        RESPONSEHEADERS: 'responseHeaders',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnResponseStartedOptions: {
        RESPONSEHEADERS: 'responseHeaders',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnBeforeRedirectOptions: {
        RESPONSEHEADERS: 'responseHeaders',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnBeforeRedirectOptions: {
        RESPONSEHEADERS: 'responseHeaders',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnCompletedOptions: {
        RESPONSEHEADERS: 'responseHeaders',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnCompletedOptions: {
        RESPONSEHEADERS: 'responseHeaders',
        EXTRAHEADERS: 'extraHeaders',
      },
      OnErrorOccurredOptions: { EXTRAHEADERS: 'extraHeaders' },
      OnErrorOccurredOptions: { EXTRAHEADERS: 'extraHeaders' },
      IgnoredActionType: {
        REDIRECT: 'redirect',
        REQUEST_HEADERS: 'request_headers',
        RESPONSE_HEADERS: 'response_headers',
        AUTH_CREDENTIALS: 'auth_credentials',
      },
      IgnoredActionType: {
        REDIRECT: 'redirect',
        REQUEST_HEADERS: 'request_headers',
        RESPONSE_HEADERS: 'response_headers',
        AUTH_CREDENTIALS: 'auth_credentials',
      },
      handlerBehaviorChanged: i('webRequest', 'handlerBehaviorChanged', [1]),
      onBeforeRequest: e('webRequest', 'onBeforeRequest'),
      onBeforeSendHeaders: e('webRequest', 'onBeforeSendHeaders'),
      onSendHeaders: e('webRequest', 'onSendHeaders'),
      onHeadersReceived: e('webRequest', 'onHeadersReceived'),
      onAuthRequired: e('webRequest', 'onAuthRequired'),
      onResponseStarted: e('webRequest', 'onResponseStarted'),
      onBeforeRedirect: e('webRequest', 'onBeforeRedirect'),
      onCompleted: e('webRequest', 'onCompleted'),
      onErrorOccurred: e('webRequest', 'onErrorOccurred'),
      onActionIgnored: e('webRequest', 'onActionIgnored'),
    },
    windows: {
      WindowType: {
        NORMAL: 'normal',
        POPUP: 'popup',
        PANEL: 'panel',
        APP: 'app',
        DEVTOOLS: 'devtools',
      },
      WindowType: {
        NORMAL: 'normal',
        POPUP: 'popup',
        PANEL: 'panel',
        APP: 'app',
        DEVTOOLS: 'devtools',
      },
      WindowState: {
        NORMAL: 'normal',
        MINIMIZED: 'minimized',
        MAXIMIZED: 'maximized',
        FULLSCREEN: 'fullscreen',
        LOCKED_FULLSCREEN: 'locked-fullscreen',
      },
      WindowState: {
        NORMAL: 'normal',
        MINIMIZED: 'minimized',
        MAXIMIZED: 'maximized',
        FULLSCREEN: 'fullscreen',
        LOCKED_FULLSCREEN: 'locked-fullscreen',
      },
      CreateType: { NORMAL: 'normal', POPUP: 'popup', PANEL: 'panel' },
      CreateType: { NORMAL: 'normal', POPUP: 'popup', PANEL: 'panel' },
      get: i('windows', 'get', [111, 112, 114]),
      getCurrent: i('windows', 'getCurrent', [112, 114]),
      getLastFocused: i('windows', 'getLastFocused', [112, 114]),
      getAll: i('windows', 'getAll', [112, 116]),
      create: i('windows', 'create', [117, 119]),
      update: i('windows', 'update', [111, 120, 121]),
      remove: i('windows', 'remove', [122, 1]),
      onCreated: e('windows', 'onCreated'),
      onRemoved: e('windows', 'onRemoved'),
      onFocusChanged: e('windows', 'onFocusChanged'),
    },
  };
  var f = {
    alarms: {
      dependencies: ['permission:alarms'],
      contexts: ['blessed_extension'],
    },
    automation: {
      dependencies: ['manifest:automation'],
      contexts: ['blessed_extension'],
    },
    declarativeNetRequest: {
      dependencies: ['permission:declarativeNetRequest'],
      contexts: ['blessed_extension'],
    },
    'declarativeNetRequest.onRuleMatchedDebug': {
      dependencies: [
        'permission:declarativeNetRequest',
        'permission:declarativeNetRequestFeedback',
      ],
      location: 'unpacked',
    },
    declarativeWebRequest: {
      dependencies: ['permission:declarativeWebRequest'],
      contexts: ['blessed_extension'],
    },
    documentScan: {
      dependencies: ['permission:documentScan'],
      contexts: ['blessed_extension'],
    },
    idle: {
      dependencies: ['permission:idle'],
      contexts: ['blessed_extension'],
    },
    management: [
      {
        dependencies: ['permission:management'],
        contexts: ['blessed_extension'],
        default_parent: true,
      },
      {
        channel: 'stable',
        contexts: ['webui'],
        matches: ['chrome://extensions/*', 'chrome://settings/*'],
      },
    ],
    'networking.config': {
      dependencies: ['permission:networking.config'],
      contexts: ['blessed_extension'],
    },
    'networking.onc': {
      dependencies: ['permission:networking.onc'],
      contexts: ['blessed_extension'],
      source: 'networkingPrivate',
    },
    power: {
      dependencies: ['permission:power'],
      contexts: ['blessed_extension'],
    },
    printerProvider: {
      dependencies: ['permission:printerProvider'],
      contexts: ['blessed_extension'],
      disallow_for_service_workers: true,
    },
    runtime: {
      channel: 'stable',
      contexts: ['blessed_extension'],
    },
    types: {
      internal: true,
      channel: 'stable',
      extension_types: ['extension', 'legacy_packaged_app', 'platform_app'],
      contexts: ['blessed_extension'],
    },
    vpnProvider: {
      dependencies: ['permission:vpnProvider'],
      contexts: ['blessed_extension'],
    },
    webRequest: {
      dependencies: ['permission:webRequest'],
      contexts: ['blessed_extension'],
    },
    autofillPrivate: [
      {
        dependencies: ['permission:autofillPrivate'],
        contexts: ['blessed_extension'],
      },
      {
        channel: 'stable',
        contexts: ['webui'],
        matches: ['chrome://settings/*'],
      },
    ],
    bookmarkManagerPrivate: [
      {
        dependencies: ['permission:bookmarkManagerPrivate'],
        contexts: ['blessed_extension'],
      },
      {
        channel: 'stable',
        contexts: ['webui'],
        matches: ['chrome://bookmarks/*'],
      },
    ],
    bookmarks: [
      {
        dependencies: ['permission:bookmarks'],
        contexts: ['blessed_extension'],
        default_parent: true,
      },
      {
        channel: 'stable',
        contexts: ['webui'],
        matches: ['chrome://bookmarks/*', 'chrome://welcome/*'],
      },
    ],
    'bookmarks.export': {
      channel: 'stable',
      contexts: ['webui'],
      dependencies: [],
      matches: ['chrome://bookmarks/*'],
    },
    'bookmarks.import': {
      channel: 'stable',
      contexts: ['webui'],
      dependencies: [],
      matches: ['chrome://bookmarks/*'],
    },
    browserAction: {
      dependencies: ['manifest:browser_action'],
      contexts: ['blessed_extension'],
    },
    'browserAction.openPopup': {
      contexts: ['webui'],
    },
    browsingData: {
      dependencies: ['permission:browsingData'],
      contexts: ['blessed_extension'],
    },
    certificateProvider: {
      dependencies: ['permission:certificateProvider'],
      contexts: ['blessed_extension'],
    },
    commands: {
      dependencies: ['manifest:commands'],
      contexts: ['blessed_extension'],
    },
    contentSettings: {
      dependencies: ['permission:contentSettings'],
      contexts: ['blessed_extension'],
    },
    contextMenus: {
      dependencies: ['permission:contextMenus'],
      contexts: ['blessed_extension'],
    },
    cookies: {
      dependencies: ['permission:cookies'],
      contexts: ['blessed_extension'],
    },
    debugger: {
      dependencies: ['permission:debugger'],
      contexts: ['blessed_extension'],
    },
    declarativeContent: {
      dependencies: ['permission:declarativeContent'],
      contexts: ['blessed_extension'],
    },
    downloads: {
      dependencies: ['permission:downloads'],
      contexts: ['blessed_extension'],
    },
    extension: {
      channel: 'stable',
      extension_types: ['extension'],
      contexts: ['blessed_extension'],
    },
    'extension.getExtensionTabs': {
      contexts: ['blessed_extension'],
      disallow_for_service_workers: true,
    },
    extensionsManifestTypes: {
      internal: true,
      channel: 'stable',
      contexts: ['blessed_extension'],
    },
    fontSettings: {
      dependencies: ['permission:fontSettings'],
      contexts: ['blessed_extension'],
    },
    history: {
      dependencies: ['permission:history'],
      contexts: ['blessed_extension'],
    },
    identity: {
      dependencies: ['permission:identity'],
      contexts: ['blessed_extension'],
    },
    'identity.getAccounts': {
      channel: 'dev',
      dependencies: ['permission:identity'],
      contexts: ['blessed_extension'],
    },
    identityPrivate: {
      dependencies: ['permission:identityPrivate'],
      contexts: ['blessed_extension'],
    },
    languageSettingsPrivate: [
      {
        dependencies: ['permission:languageSettingsPrivate'],
        contexts: ['blessed_extension'],
      },
      {
        channel: 'stable',
        contexts: ['webui'],
        matches: ['chrome://settings/*'],
      },
    ],
    notifications: {
      dependencies: ['permission:notifications'],
      contexts: ['blessed_extension'],
    },
    omnibox: {
      dependencies: ['manifest:omnibox'],
      contexts: ['blessed_extension'],
    },
    pageAction: {
      dependencies: ['manifest:page_action'],
      contexts: ['blessed_extension'],
      disallow_for_service_workers: true,
    },
    pageCapture: {
      dependencies: ['permission:pageCapture'],
      contexts: ['blessed_extension'],
      disallow_for_service_workers: true,
    },
    passwordsPrivate: {
      contexts: ['webui'],
      matches: ['chrome://settings/*'],
    },
    permissions: {
      contexts: ['blessed_extension'],
    },
    printing: {
      dependencies: ['permission:printing'],
      contexts: ['blessed_extension'],
    },
    printingMetrics: {
      dependencies: ['permission:printingMetrics'],
      contexts: ['blessed_extension'],
    },
    privacy: {
      dependencies: ['permission:privacy'],
      contexts: ['blessed_extension'],
    },
    processes: {
      dependencies: ['permission:processes'],
      contexts: ['blessed_extension'],
    },
    proxy: {
      dependencies: ['permission:proxy'],
      contexts: ['blessed_extension'],
    },
    sessions: {
      dependencies: ['permission:sessions'],
      contexts: ['blessed_extension'],
    },
    settingsPrivate: {
      contexts: ['webui'],
      matches: ['chrome://settings/*'],
    },
    tabCapture: {
      dependencies: ['permission:tabCapture'],
      contexts: ['blessed_extension'],
      disallow_for_service_workers: true,
    },
    tabs: {
      contexts: ['blessed_extension', 'webui'],
    },
    topSites: {
      dependencies: ['permission:topSites'],
      contexts: ['blessed_extension'],
    },
    tts: {
      dependencies: ['permission:tts'],
      contexts: ['blessed_extension'],
    },
    ttsEngine: {
      dependencies: ['permission:ttsEngine'],
      contexts: ['blessed_extension'],
    },
    webNavigation: {
      dependencies: ['permission:webNavigation'],
      contexts: ['blessed_extension'],
    },
    windows: [
      {
        dependencies: ['api:tabs'],
        contexts: ['blessed_extension'],
      },
      {
        channel: 'stable',
        contexts: ['webui'],
      },
    ],
    dialogsPrivate: {
      contexts: ['webui'],
    },
    tabsPrivate: {
      contexts: ['webui'],
    },
    browserActionPrivate: {
      contexts: ['webui'],
    },
  };
  const c = {};

  const processDeclaration = (name, decl) => {
    if (!decl.contexts || decl.contexts.includes(context)) {
      if (api[name]) c[name] = api[name];
    }
  };

  for (const key in f) {
    if (f[key] instanceof Array) {
      for (const decl of f[key]) {
        processDeclaration(key, decl);
      }
    } else if (typeof f[key] === 'object') {
      processDeclaration(key, f[key]);
    }
  }

  return c;
};
module.exports = getAPI;
