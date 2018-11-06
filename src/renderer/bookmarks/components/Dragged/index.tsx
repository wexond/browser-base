import { observer } from 'mobx-react';
import * as React from 'react';

import store from '@bookmarks/store';
import { Root, IconContainer, Icon, Title } from './styles';
import { icons, transparency } from '@/constants/renderer';

@observer
export default class extends React.Component {
  public render() {
    const { dragged, mousePos } = store;

    const style = mousePos && {
      left: mousePos.x,
      top: mousePos.y,
    };

    let opacity = transparency.light.inactiveIcon;
    let favicon = icons.page;

    if (dragged != null && dragged.type === 'folder') {
      favicon = icons.folder;
    } else if (dragged != null && dragged.favicon.trim() !== '') {
      favicon = dragged.favicon;
      opacity = 1;
    }

    return (
      <Root style={style}>
        {dragged && (
          <React.Fragment>
            <IconContainer>
              <Icon src={favicon} style={{ opacity }} />
            </IconContainer>
            <Title>{dragged.title}</Title>
          </React.Fragment>
        )}
      </Root>
    );
  }
}
