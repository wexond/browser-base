import * as React from 'react';

import { Dropdown } from '~/renderer/components/Dropdown';
import Switch from '~/renderer/components/Switch';
import { Title, Row, Control, Header } from '../App/style';
import store from '../../store';
import { onSwitchChange } from '../../utils';
import { observer } from 'mobx-react-lite';

const onThemeChange = (value: string) => {
  store.settings.theme = value;
  store.save();
};

const ThemeVariant = observer(() => {
  const defaultValue = store.settings.theme;

  return (
    <Row>
      <Title>Theme variant</Title>
      <Control>
        <Dropdown defaultValue={defaultValue} onChange={onThemeChange}>
          <Dropdown.Item value="wexond-light">Light</Dropdown.Item>
          <Dropdown.Item value="wexond-dark">Dark</Dropdown.Item>
        </Dropdown>
      </Control>
    </Row>
  );
});

const MenuAnimations = observer(() => {
  const { animations } = store.settings;

  return (
    <Row>
      <Title>Menu animations</Title>
      <Control>
        <Switch
          onChange={onSwitchChange('animations')}
          defaultValue={animations}
        />
      </Control>
    </Row>
  );
});

const BookmarksBar = observer(() => {
  const { bookmarksBar } = store.settings;

  return (
    <Row>
      <Title>Show bookmarks bar</Title>
      <Control>
        <Switch
          onChange={onSwitchChange('bookmarksBar')}
          defaultValue={bookmarksBar}
        />
      </Control>
    </Row>
  );
});

export const Appearance = observer(() => {
  return (
    <>
      <Header>Appearance</Header>
      <MenuAnimations />
      <BookmarksBar />
      <ThemeVariant />
    </>
  );
});
