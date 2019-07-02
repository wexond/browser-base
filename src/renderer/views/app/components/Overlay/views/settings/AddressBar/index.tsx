import * as React from 'react';

import store from '~/renderer/views/app/store';
import { darkTheme, lightTheme } from '~/renderer/constants';
import { Dropdown } from '~/renderer/components/Dropdown';
import Switch from '~/renderer/components/Switch';
import { Content } from '../../../style';
import { Title, Row, Control, Header } from '../style';
import { onSwitchChange } from '~/renderer/views/app/utils';

const SuggestionsToggle = () => {
  const { suggestions } = store.settings.object;

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
  store.settings.object.searchEngine = store.settings.object.searchEngines.find(
    x => x.name === value,
  );
  store.settings.save();
};

const SearchEngine = () => {
  const { searchEngine, searchEngines } = store.settings.object;

  return (
    <Row>
      <Title>Show search and site suggestions</Title>
      <Control>
        <Dropdown
          defaultValue={searchEngine.name}
          onChange={onSearchEngineChange}
        >
          {searchEngines.map((engine, key)) => (
            <Dropdown.Item>{engine.name}</Dropdown.Item>
          )}
        </Dropdown>
      </Control>
    </Row>
  );
};

export const AddressBar = () => {
  return (
    <Content>
      <Header>Search engine</Header>
      <SuggestionsToggle />
      <SearchEngine />
    </Content>
  );
};
