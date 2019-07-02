import store from '../store';

export const onSwitchChange = (key: string) => (value: boolean) => {
  (store.settings.object as any)[key] = value;
  store.settings.save();
};
