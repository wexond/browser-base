import React from 'react';
import { observer } from 'mobx-react';

import { StyledSearchInput, SearchIcon, Input } from './styles';

export interface IProps {
  image?: string;
}

@observer
export default class SearchInput extends React.Component<IProps, {}> {
  private input: HTMLInputElement;

  public render() {
    const { image } = this.props;

    return (
      <StyledSearchInput>
        <SearchIcon />
        <Input
          innerRef={r => {
            this.input = r;
          }}
          placeholder="Search"
        />
      </StyledSearchInput>
    );
  }
}
