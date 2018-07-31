import { observer } from 'mobx-react';
import React from 'react';
import { StyledContainer } from './styles';
import Toolbar from '../Toolbar';
import store from '../../../store';

@observer
export default class NavigationButtons extends React.Component {
  public onBackClick = () => {
    store.getSelectedPage().webview.goBack();
  };

  public onForwardClick = () => {
    store.getSelectedPage().webview.goForward();
  };

  public onRefreshClick = () => {
    store.getSelectedPage().webview.reload();
  };

  public render() {
    return (
      <StyledContainer isFullscreen={store.isFullscreen}>
        <Toolbar.Button
          disabled={!store.navigationState.canGoBack}
          size={24}
          icon={backIcon}
          style={{ marginLeft: 4 }}
          onClick={this.onBackClick}
        />
        <Toolbar.Button
          disabled={!store.navigationState.canGoForward}
          size={24}
          icon={forwardIcon}
          onClick={this.onForwardClick}
        />
        <Toolbar.Button size={20} icon={refreshIcon} onClick={this.onRefreshClick} />
      </StyledContainer>
    );
  }
}
