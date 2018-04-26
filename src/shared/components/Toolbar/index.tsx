import React from 'react';
import { observer } from 'mobx-react';

import ToolbarIcon from '../ToolbarIcon';

import { StyledToolbar, Title } from './styles';

const menuIcon = require('../../icons/actions/menu.svg');

export interface IProps {
  title?: string;
}

@observer
export default class Toolbar extends React.Component<IProps, {}> {
  public render() {
    const { title, children } = this.props;

    return (
      <StyledToolbar>
        <ToolbarIcon image={menuIcon} />
        <Title>{title}</Title>
      </StyledToolbar>
    );
  }
}
