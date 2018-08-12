import { observer } from 'mobx-react';
import React from 'react';
import { icons } from '../../../../defaults';
import { getSelectedPage } from '../../../../utils';
import store from '../../../store';
import Toolbar from '../Toolbar';
import { StyledContainer } from './styles';

@observer
export default class NavigationButtons extends React.Component {
  public onBackClick = () => {
    getSelectedPage().webview.goBack();
  }

  public onForwardClick = () => {
    getSelectedPage().webview.goForward();
  }

  public onRefreshClick = () => {
    getSelectedPage().webview.reload();
  }

  public render() {
    return (
      <StyledContainer isFullscreen={store.isFullscreen}>
        <Toolbar.Button
          disabled={!store.navigationState.canGoBack}
          size={24}
          icon={icons.back}
          style={{ marginLeft: 4 }}
          onClick={this.onBackClick}
        />
        <Toolbar.Button
          disabled={!store.navigationState.canGoForward}
          size={24}
          icon={icons.forward}
          onClick={this.onForwardClick}
        />
        <Toolbar.Button
          size={20}
          icon={icons.refresh}
          onClick={this.onRefreshClick}
        />
      </StyledContainer>
    );
  }
}
