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
  return chromeType;
};

const getChromeType = (obj) => {
  if (obj instanceof Array) return 'array';
  return typeof obj;
};

const i = (scope, name, parameters) => async (...args) => {
  const expectedParams = parameters.map((x) => ({ ...p[x] }));
  const data = {};

  for (const param of expectedParams) {
    if (param.ref) {
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
          .map((x) => `${x.optional ? 'optional ' : ''}${x.type} ${x.name}`)
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
