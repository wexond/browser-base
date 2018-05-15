import React from 'react';
import { observer } from 'mobx-react';
import { Styled, Dark } from './styles';

import Store from '../../store';

interface Props {
  children?: any;
  contentVisible?: boolean;
}

@observer
export default class extends React.Component<Props, {}> {
  public static defaultProps = {
    contentVisible: false,
  };

  public onDarkClick = () => {
    requestAnimationFrame(() => {
      Store.navigationDrawer.visible = false;
      Store.navigationDrawer.selectedItem = '';
    });
  };

  public render() {
    const { children, contentVisible } = this.props;

    return (
      <React.Fragment>
        <Styled visible={Store.navigationDrawer.visible} contentVisible={contentVisible}>
          {children}
        </Styled>
        <Dark onClick={this.onDarkClick} visible={Store.navigationDrawer.visible} />
      </React.Fragment>
    );
  }
}
