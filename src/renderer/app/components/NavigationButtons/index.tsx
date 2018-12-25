import { observer } from 'mobx-react';
import * as React from 'react';

import store from '~/renderer/app/store';
import ToolbarButton from '~/renderer/app/components/ToolbarButton';
import { icons } from '~/renderer/app/constants/icons';
import { StyledContainer } from './style';

@observer
export default class NavigationButtons extends React.Component {
  public onBackClick = () => {};

  public onForwardClick = () => {};

  public onRefreshClick = () => {};

  public render() {
    return (
      <StyledContainer isFullscreen={store.isFullscreen}>
        <ToolbarButton
          disabled={false}
          size={24}
          icon={icons.back}
          style={{ marginLeft: 4 }}
          onClick={this.onBackClick}
        />
        <ToolbarButton
          disabled={false}
          size={24}
          icon={icons.forward}
          onClick={this.onForwardClick}
        />
        <ToolbarButton
          size={20}
          icon={icons.refresh}
          onClick={this.onRefreshClick}
        />
      </StyledContainer>
    );
  }
}
