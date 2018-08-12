import { getSelectedTab } from '.';
import store from '../renderer/store';
import { Page } from '../interfaces';

export const getPageById = (id: number) => store.pages.find(x => x.id === id);

export const getSelectedPage = () => getPageById(getSelectedTab().id);

export const createPage = (tabId: number, url: string) => {
  const page: Page = {
    id: tabId,
    url,
  };
  store.pages.push(page);
  return page;
};
