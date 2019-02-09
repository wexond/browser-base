import { observer } from 'mobx-react';
import * as React from 'react';

import store from '~/renderer/app/store';
import ToolbarButton from '~/renderer/app/components/ToolbarButton';
import { icons } from '~/renderer/app/constants/icons';
import { StyledContainer } from './style';

const onBackClick = () => {};

const onForwardClick = () => {};

const onRefreshClick = () => {};

export const NavigationButtons = observer(() => {
  return (
    <StyledContainer isFullscreen={store.isFullscreen}>
      <ToolbarButton
        disabled={false}
        size={24}
        icon={icons.back}
        style={{ marginLeft: 4 }}
        onClick={onBackClick}
      />
      <ToolbarButton
        disabled={false}
        size={24}
        icon={icons.forward}
        onClick={onForwardClick}
      />
      <ToolbarButton size={20} icon={icons.refresh} onClick={onRefreshClick} />
    </StyledContainer>
  );
});
