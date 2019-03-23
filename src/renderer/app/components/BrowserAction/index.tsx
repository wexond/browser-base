import * as React from 'react';
import { observer } from 'mobx-react';
import { BrowserAction } from '../../models';
import { StyledBrowserAction, Badge } from './style';
import ToolbarButton from '../ToolbarButton';

interface Props {
  data: BrowserAction;
}

export default observer(({ data }: Props) => {
  const { icon, badgeText, badgeBackgroundColor, badgeTextColor } = data;

  return (
    <StyledBrowserAction>
      <ToolbarButton opacity={1} size={16} icon={icon} />
      {badgeText.trim() !== '' && (
        <Badge background={badgeBackgroundColor} color={badgeTextColor}>
          {badgeText}
        </Badge>
      )}
    </StyledBrowserAction>
  );
});
