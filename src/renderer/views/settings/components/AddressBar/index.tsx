import * as React from 'react';

import { Dropdown } from '~/renderer/components/Dropdown';
import { Switch } from '~/renderer/components/Switch';
import { Title, Control, Header, Back, Row } from '../App/style';
import store from '../../store';
import { onSwitchChange } from '../../utils';
import { observer } from 'mobx-react-lite';
import {
  EnginesTable,
  TableRow,
  TableCell,
  TableHeader,
  MoreButton,
} from './style';
import { NormalButton } from '../App';
import { ISearchEngine } from '~/interfaces';

const SuggestionsToggle = observer(() => {
  const { suggestions } = store.settings;

  return (
    <Row onClick={onSwitchChange('suggestions')}>
      <Title>Show search and site suggestions</Title>
      <Control>
        <Switch value={suggestions} />
      </Control>
    </Row>
  );
});

const onSearchEngineChange = (value: string) => {
  const { searchEngines } = store.settings;
  store.settings.searchEngine = searchEngines.indexOf(
    searchEngines.find((x) => x.name === value),
  );
  store.save();
};

const SearchEngineRow = observer(() => {
  const se = store.searchEngine;

  return (
    <Row>
      <Title>Search engine used in the address bar</Title>
      <Control>
        <Dropdown defaultValue={se.name} onChange={onSearchEngineChange}>
          {Object.values(store.settings.searchEngines).map((item, key) => (
            <Dropdown.Item key={key} value={item.name}>
              {item.name}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </Control>
    </Row>
  );
});

const onBackClick = () => {
  store.selectedSection = 'address-bar';
};

const onMoreClick = (data: ISearchEngine) => (
  e: React.MouseEvent<HTMLDivElement>,
) => {
  const { top, left } = e.currentTarget.getBoundingClientRect();
  store.menuInfo.left = left - store.menuRef.current.offsetWidth;
  store.menuInfo.top = top;

  store.editedSearchEngine = data;
  store.menuVisible = true;
};

export const SearchEngine = observer(({ data }: { data: ISearchEngine }) => {
  const isDefault = store.searchEngine.keyword === data.keyword;
  return (
    <TableRow bold={isDefault}>
      <TableCell>
        <div>
          {data.name} {isDefault && '(Default)'}
        </div>
      </TableCell>
      <TableCell>
        <div>{data.keyword}</div>
      </TableCell>
      <TableCell>
        <div>{data.url}</div>
      </TableCell>
      <MoreButton onClick={onMoreClick(data)}></MoreButton>
    </TableRow>
  );
});

const onAddClick = () => {
  store.dialogVisible = true;
  store.dialogContent = 'add-search-engine';
  store.searchEngineInputRef.current.value = '';
  store.searchEngineKeywordInputRef.current.value = '';
  store.searchEngineUrlInputRef.current.value = '';
};

export const ManageSearchEngines = observer(() => {
  return (
    <>
      <Header>
        <Back onClick={onBackClick} />
        Manage search engines
      </Header>
      <Row>
        <Title>Address bar search engines</Title>
        <Control>
          <NormalButton onClick={onAddClick}>Add</NormalButton>
        </Control>
      </Row>
      <EnginesTable>
        <TableRow>
          <TableHeader>Search engine</TableHeader>
          <TableHeader>Keyword</TableHeader>
          <TableHeader>URL</TableHeader>
          <TableHeader></TableHeader>
        </TableRow>
        {store.settings.searchEngines.map((item, key) => (
          <SearchEngine key={item.keyword} data={item} />
        ))}
      </EnginesTable>
    </>
  );
});

const onManageSearchEngines = () => {
  store.selectedSection = 'search-engines';
};

export const AddressBar = observer(() => {
  return (
    <>
      <Header>Address bar</Header>
      <SuggestionsToggle />
      <SearchEngineRow />
      <Row onClick={onManageSearchEngines}>
        <Title>Manage search engines</Title>
        <Control></Control>
      </Row>
    </>
  );
});
