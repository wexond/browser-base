import React from 'react';
import { observer } from 'mobx-react';
import SearchInput from '../SearchInput';
import { StyledToolbar, Title } from './styles';

export interface IProps {
  title?: string;
}

@observer
export default class Toolbar extends React.Component<IProps, {}> {
  public render() {
    const { title } = this.props;

    return (
      <StyledToolbar>
        <Title>{title}</Title>
        <SearchInput />
      </StyledToolbar>
    );
  }
}
