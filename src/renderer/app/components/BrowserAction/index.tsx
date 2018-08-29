import React from 'react';
import ToolbarButton from '@app/components/ToolbarButton';
import { StyledBrowserAction, Badge } from './styles';
import { BrowserAction } from '@app/models/browser-action';

interface Props {
  browserAction: BrowserAction;
}

export default class extends React.Component<Props> {
  public render() {
    const { browserAction } = this.props;
    const {
      icon,
      badgeText,
      badgeBackgroundColor,
      badgeTextColor,
    } = browserAction;
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
  }
}
