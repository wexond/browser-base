import { observer } from 'mobx-react';
import React from 'react';
import { StyledContainer } from './styles';
import Store from '../../store';
import Toolbar from '../Toolbar';

const backIcon = require('../../../shared/icons/back.svg');
const forwardIcon = require('../../../shared/icons/forward.svg');
const refreshIcon = require('../../../shared/icons/refresh.svg');

@observer
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
