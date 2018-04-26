import React from 'react';
import { observer } from 'mobx-react';

import ToolbarIcon from '../ToolbarIcon';
import SearchInput from '../SearchInput';

import { StyledToolbar, Title } from './styles';

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
        <ToolbarIcon image={menuIcon} />
        <Title>{title}</Title>
        <SearchInput />
      </StyledToolbar>
    );
  }
}
