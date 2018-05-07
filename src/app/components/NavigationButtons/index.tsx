import React from 'react';
import Toolbar from '../Toolbar';
import { StyledContainer } from './styles';
import Store from '../../store';

const backIcon = require('../../../shared/icons/actions/back.svg');
const forwardIcon = require('../../../shared/icons/actions/forward.svg');
const refreshIcon = require('../../../shared/icons/actions/refresh.svg');

export default class NavigationButtons extends React.Component {
  public onBackClick = () => {
    Store.getSelectedPage().webview.goBack();
  };

  public onForwardClick = () => {
    Store.getSelectedPage().webview.goForward();
  };

  public onRefreshClick = () => {
    Store.getSelectedPage().webview.reload();
  };

  public render() {
    return (
      <StyledContainer isFullscreen={Store.isFullscreen}>
        <Toolbar.Button
          disabled={!Store.navigationState.canGoBack}
          size={24}
          icon={backIcon}
          style={{ marginLeft: 4 }}
          onClick={this.onBackClick}
        />
        <Toolbar.Button
          disabled={!Store.navigationState.canGoForward}
          size={24}
          icon={forwardIcon}
          onClick={this.onForwardClick}
        />
        <Toolbar.Button size={20} icon={refreshIcon} onClick={this.onRefreshClick} />
      </StyledContainer>
    );
  }
}
