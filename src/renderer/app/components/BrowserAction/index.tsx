import * as React from 'react';
import { observer } from 'mobx-react';
import { BrowserAction } from '../../models';
import { StyledBrowserAction, Badge } from './style';
import ToolbarButton from '../ToolbarButton';

interface Props {
  data: BrowserAction;
  size?: number;
  style?: any;
}

const Component = observer(({ data, size, style }: Props) => {
  const { icon, badgeText, badgeBackgroundColor, badgeTextColor } = data;

  return (
    <StyledBrowserAction style={style}>
      <ToolbarButton opacity={1} size={size} icon={icon} />
      {badgeText.trim() !== '' && (
        <Badge background={badgeBackgroundColor} color={badgeTextColor}>
          {badgeText}
        </Badge>
      )}
    </StyledBrowserAction>
  );
});

(Component as any).defaultProps = {
  size: 16,
};

export default Component;
