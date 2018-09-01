import { observer } from 'mobx-react';
import React from 'react';

import store from '@app/store';
import ContextMenuSeparator from '@components/ContextMenuSeparator';
import MenuItem from '../MenuItem';
import { Container } from './styles';
import { icons } from '~/renderer/defaults';

interface Props {
  children?: any;
  title?: string;
}

@observer
export default class extends React.Component<Props, {}> {
  public render() {
    return (
      <Container>
        <MenuItem title="History" icon={icons.history} />
        <MenuItem title="Downloads" icon={icons.download} />
        <MenuItem title="Bookmarks" icon={icons.bookmarks} />
        <ContextMenuSeparator />
        <MenuItem title="Extensions" icon={icons.extensions} />
        <MenuItem title="Settings" icon={icons.settings} />
        <ContextMenuSeparator />
        <MenuItem title="About" icon={icons.info} />
      </Container>
    );
  }
}
