import { observer } from 'mobx-react';
import React from 'react';
import Toolbar from '../Toolbar';
import { StyledContainer } from './styles';
import store from 'app-store';
import { icons } from 'defaults';

@observer
export default class NavigationButtons extends React.Component {
  public onBackClick = () => {
    store.pagesStore.getSelected().webview.goBack();
  };

  public onForwardClick = () => {
    store.pagesStore.getSelected().webview.goForward();
  };

  public onRefreshClick = () => {
    store.pagesStore.getSelected().webview.reload();
  };

  public render() {
    return (
      <StyledContainer isFullscreen={store.isFullscreen}>
        <Toolbar.Button
          disabled={!store.navigationStateStore.canGoBack}
          size={24}
          icon={icons.back}
          style={{ marginLeft: 4 }}
          onClick={this.onBackClick}
        />
        <Toolbar.Button
          disabled={!store.navigationStateStore.canGoForward}
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
