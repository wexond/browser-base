import React from 'react';
import { StyledSearch, Input, Icon } from './styles';

export default class Search extends React.Component {
  public render() {
    return (
      <StyledSearch>
        <Icon />
        <Input placeholder="Search" />
      </StyledSearch>
    );
  }
}
