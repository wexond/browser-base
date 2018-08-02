const { remote } = require('electron');
const { runInThisContext } = require('vm');
const fs = require('fs');
const path = require('path');

const injectAPI = require('./api');

const matchesPattern = pattern => {
  if (pattern === '<all_urls>') {
    return true;
  }

  const regexp = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
  const url = `${location.protocol}//${location.host}${location.pathname}`;
  return url.match(regexp);
};

const runContentScript = (url, code) => {
  const context = injectAPI();

  const wrapper = `((wexond) => {
    var chrome = wexond;
    ${code}
  });`;

  const compiledWrapper = runInThisContext(wrapper, {
    filename: url,
    lineOffset: 1,
    displayErrors: true,
  });

  return compiledWrapper.call(this, context);
};

const runStylesheet = (url, code) => {
  const wrapper = `((code) => {
    function init() {
      const styleElement = document.createElement('style');
      styleElement.textContent = code;
      document.head.append(styleElement);
    }
    document.addEventListener('DOMContentLoaded', init);
  })`;

  const compiledWrapper = runInThisContext(wrapper, {
    filename: url,
    lineOffset: 1,
    displayErrors: true,
  });

  return compiledWrapper.call(this, code);
};

const injectContentScript = script => {
  if (!script.matches.some(matchesPattern)) {
    return;
  }

  process.setMaxListeners(0);

  if (script.js) {
    script.js.forEach(js => {
      const fire = runContentScript.bind(window, js.url, js.code);
      if (script.runAt === 'document_start') {
        process.once('document-start', fire);
      } else if (script.runAt === 'document_end') {
        process.once('document-end', fire);
      } else {
        document.addEventListener('DOMContentLoaded', fire);
      }
    });
  }

  if (script.css) {
    script.css.forEach(css => {
      const fire = runStylesheet.bind(window, css.url, css.code);
      if (script.runAt === 'document_start') {
        process.once('document-start', fire);
      } else if (script.runAt === 'document_end') {
        process.once('document-end', fire);
      } else {
        document.addEventListener('DOMContentLoaded', fire);
      }
    });
  }
};

const extensions = remote.getGlobal('extensions');

for (const manifest of extensions) {
  if (manifest.content_scripts) {
    const readArrayOfFiles = relativePath => ({
      url: `wexond-extension://${manifest.extensionId}/${relativePath}`,
      code: fs.readFileSync(path.join(manifest.srcDirectory, relativePath), 'utf8'),
    });

    try {
      manifest.content_scripts.forEach(script => {
        const newScript = {
          matches: script.matches,
          js: script.js ? script.js.map(readArrayOfFiles) : [],
          css: script.css ? script.css.map(readArrayOfFiles) : [],
          runAt: script.run_at || 'document_idle',
        };

        console.log(newScript.js);

        injectContentScript(newScript);
      });
    } catch (readError) {
      console.error('Failed to read content scripts', readError);
    }
  }
}
