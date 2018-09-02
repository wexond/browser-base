import React from 'react';

import { Actions, Content, Root } from './styles';

interface Props {
  children: any;
  visible: boolean;
}

export default class Snackbar extends React.Component<Props, {}> {
  public static Content = Content;

  public static Actions = Actions;

  public render() {
    const { children, visible } = this.props;

    return <Root visible={visible}>{children}</Root>;
  }
}
