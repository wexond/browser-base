import { getSelectedTab } from '.';
import { Page } from '../models';
import store from '../renderer/store';

export const getPageById = (id: number) => store.pages.find(x => x.id === id);

export const getSelectedPage = () => getPageById(getSelectedTab().id);

export const createPage = (tabId: number, url: string) => new Page(tabId, url);
