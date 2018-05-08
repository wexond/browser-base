import React from 'react';
import { observer } from 'mobx-react';
import Search from '../Search';
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
        <Search />
      </StyledToolbar>
    );
  }
}
