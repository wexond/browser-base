import * as React from 'react';

import { Dropdown } from '~/renderer/components/Dropdown';
import Switch from '~/renderer/components/Switch';
import { Content } from '../../../app/components/Overlay/style';
import { Title, Row, Control, Header } from '../App/style';
import store from '../../store';
import { onSwitchChange } from '../../utils';

const SuggestionsToggle = () => {
  const { suggestions } = store.settings;

  return (
    <Row>
      <Title>Show search and site suggestions</Title>
      <Control>
        <Switch
          onChange={onSwitchChange('suggestions')}
          defaultValue={suggestions}
        />
      </Control>
    </Row>
  );
};

const onSearchEngineChange = (value: string) => {
  const { searchEngines } = store.settings;
  store.settings.searchEngine = searchEngines.indexOf(
    searchEngines.find(x => x.name === value),
  );
  store.save();
};

const SearchEngine = () => {
  const se = store.searchEngine;

  return (
    <Row>
      <Title>Search engine used in the address bar</Title>
      <Control>
        <Dropdown defaultValue={se.name} onChange={onSearchEngineChange}>
          {Object.values(store.searchEngines).map((item, key) => (
            <Dropdown.Item key={key} value={item.name}>
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </Control>
    </Row>
  );
};

export const AddressBar = () => {
  return (
    <Content>
      <Header>Address bar</Header>
      <SuggestionsToggle />
      <SearchEngine />
    </Content>
  );
};
