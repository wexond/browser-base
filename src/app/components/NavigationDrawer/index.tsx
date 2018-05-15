import React from 'react';
import { observer } from 'mobx-react';
import { Styled, Dark } from './styles';

import Store from '../../store';
import NavigationDrawerModel from '../../models/navigation-drawer';

interface Props {
  children?: any;
  contentVisible?: boolean;
  store: NavigationDrawerModel;
}

@observer
export default class NavigationDrawer extends React.Component<Props, {}> {
  public static defaultProps = {
    contentVisible: false,
    visible: false,
  };

  public onDarkClick = () => {
    const { store } = this.props;

    requestAnimationFrame(() => {
      store.visible = false;
      store.selectedItem = '';
    });
  };

  public render() {
    const { children, contentVisible, store } = this.props;

    return (
      <React.Fragment>
        <Styled visible={store.visible} contentVisible={contentVisible}>
          {children}
        </Styled>
        <Dark onClick={this.onDarkClick} visible={store.visible} />
      </React.Fragment>
    );
  }
}
