import { WEBUI_BASE_URL, WEBUI_URL_SUFFIX } from '../constants/protocols';

export const getWebUIURL = (path: string) =>
  `${WEBUI_BASE_URL}${path}${WEBUI_URL_SUFFIX}`;
