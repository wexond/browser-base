import { observer } from 'mobx-react';
import React from 'react';

import store from '@app/store';
import { Root, Icon } from './styles';

interface Props {
  icon: string;
  title: string;
}

@observer
export default class MenuItem extends React.Component<Props, {}> {
  public render() {
    const { icon, title } = this.props;

    return (
      <Root>
        <Icon src={icon} />
        {title}
      </Root>
    );
  }
}
