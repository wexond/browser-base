import { observer } from 'mobx-react-lite';
import * as React from 'react';

import { StyledToolbar } from './style';
import { NavigationButtons } from '../NavigationButtons';

import { AddressBar } from '../AddressBar';
import { RightButtons } from '../RightButtons';

export const Toolbar = observer(() => {
  return (
    <StyledToolbar>
      <NavigationButtons />
      <AddressBar />
      <RightButtons />
    </StyledToolbar>
  );
});
