import { observer } from 'mobx-react';
import * as React from 'react';

import { Root, Icon } from './styles';

interface Props {
  icon: string;
  title: string;
  onClick?: any;
}

@observer
export default class MenuItem extends React.Component<Props, {}> {
  public render() {
    const { icon, title, onClick } = this.props;

    return (
      <Root onClick={onClick}>
        <Icon src={icon} />
        {title}
      </Root>
    );
  }
}
