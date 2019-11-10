import store from '../store';

export const onSwitchChange = (key: string) => (value: boolean) => {
  (store.settings as any)[key] = value;
  store.save();
};
