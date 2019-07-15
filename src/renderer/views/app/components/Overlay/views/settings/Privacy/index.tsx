import * as React from 'react';

import Checkbox from '~/renderer/components/Checkbox';
import { Content } from '../../../style';
import { Header } from '../style';

export const Privacy = () => {
  return (
    <Content>
      <Header>Privacy</Header>
      <Checkbox />
    </Content>
  );
};
