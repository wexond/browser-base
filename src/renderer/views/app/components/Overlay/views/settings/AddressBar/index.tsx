import * as React from 'react';

import store from '~/renderer/views/app/store';
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
  const { searchEngines } = store.settings.object;
  store.settings.object.searchEngine = searchEngines.indexOf(
    searchEngines.find(x => x.name === value),
  );
  store.settings.save();
};

/*        <Dropdown defaultValue={se.name} onChange={onSearchEngineChange}>
          {searchEngines.map((item, key) => (
            <Dropdown.Item key={key}>{item.name}</Dropdown.Item>
          ))}
        </Dropdown>
        */
  
const SearchEngine = () => {
  const { searchEngine, searchEngines } = store.settings.object;
  const se = searchEngines[searchEngine];

  return (
    <Row>
      <Title>Search engine used in the address bar</Title>
      <Control>

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
