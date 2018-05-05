import React from 'react';
import { observer } from 'mobx-react';

import ToolbarIcon from '../ToolbarIcon';
import SearchInput from '../SearchInput';

import { StyledToolbar, Title, Content, Line } from './styles';

const menuIcon = require('../../icons/actions/menu.svg');

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
