const EXTENSION_PROTOCOL_NAME = 'chrome-extension';
export const WEBUI_PROTOCOL_NAME = 'wexond';

export const EXTENSION_PROTOCOL = {
  name: EXTENSION_PROTOCOL_NAME,
  scheme: `${EXTENSION_PROTOCOL_NAME}://`,
};

export const WEBUI_BASE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:4444/'
    : `${WEBUI_PROTOCOL_NAME}://`;

export const WEBUI_URL_SUFFIX = WEBUI_BASE_URL.startsWith('http')
  ? '.html'
  : '';
