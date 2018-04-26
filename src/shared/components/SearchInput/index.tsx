import React from 'react';
import { observer } from 'mobx-react';

import { StyledSearchInput, SearchIcon, Input } from './styles';

export interface IProps {
  image?: string;
}

export interface IState {
  searchIconVisible: boolean;
}

@observer
export default class SearchInput extends React.Component<IProps, IState> {
  public state: IState = {
    searchIconVisible: true,
  };

  private input: HTMLInputElement;

  onInputState = (e: React.FormEvent<HTMLInputElement>) => {
    if (
      (e.type !== 'focus' && e.type !== 'blur') ||
      (e.type === 'blur' && this.input.value.length > 0)
    ) { return; }

    this.setState({
      searchIconVisible: e.type === 'blur',
    });
  };

  public render() {
    const { image } = this.props;
    const { searchIconVisible } = this.state;

    const inputPlaceHolder = searchIconVisible ? 'Search' : '';

    return (
      <StyledSearchInput>
        <SearchIcon visible={searchIconVisible} />
        <Input
          innerRef={r => {
            this.input = r;
          }}
          placeholder={inputPlaceHolder}
          onFocus={this.onInputState}
          onBlur={this.onInputState}
        />
      </StyledSearchInput>
    );
  }
}
