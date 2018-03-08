import { IPage } from "../interfaces";

import Store from "../store";

export const addPage = (tabId: number): IPage => {
  const page = {
    id: tabId,
    url: "about:blank"
  };

  const index = Store.pages.push(page) - 1;

  return Store.pages[index];
};
