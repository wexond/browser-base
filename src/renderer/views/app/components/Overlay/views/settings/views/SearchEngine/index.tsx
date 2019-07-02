import * as React from 'react';

import store from '~/renderer/views/app/store';
import { darkTheme, lightTheme } from '~/renderer/constants';
import { Dropdown } from '~/renderer/components/Dropdown';
import Switch from '~/renderer/components/Switch';
import { Content } from '../../../../style';
import { Title, Row, Control, Header } from '../style';

export const SearchEngine = () => {
  return (
    <Content>
      <Header>Search engine</Header>
    </Content>
  );
};
