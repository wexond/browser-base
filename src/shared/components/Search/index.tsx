import React from 'react';
import { observer } from 'mobx-react';
import { StyledSearch, SearchIcon, Input } from './styles';

export interface IProps {
  image?: string;
}

@observer
export default class Search extends React.Component<IProps, {}> {
  private input: HTMLInputElement;

  public render() {
    return (
      <StyledSearch>
        <SearchIcon />
        <Input
          innerRef={r => {
            this.input = r;
          }}
          placeholder="Search"
        />
      </StyledSearch>
    );
  }
}
