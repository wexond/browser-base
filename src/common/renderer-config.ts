import { configure } from 'mobx';

export const configureUI = () => {
  configure({ enforceActions: 'never' });
};
