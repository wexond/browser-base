import { observer } from 'mobx-react';
import React from 'react';
import transparency from '../../../../shared/defaults/opacity';
import { PageItem, PageItemIcon, PageItemRemoveIcon } from '../../../../shared/components/PageItem';
import { Title } from './styles';
import Store from '../../store';
import BookmarkItem from '../../../../shared/models/bookmark-item';

const pageIcon = require('../../../../shared/icons/page.svg');
const folderIcon = require('../../../../shared/icons/folder.svg');

@observer
export default class Item extends React.Component<{ data: BookmarkItem }, { hovered: boolean }> {
  public state = {
    hovered: false,
  };

  private cmdPressed = false;

  public componentDidMount() {
    window.addEventListener('keydown', e => {
      this.cmdPressed = e.key === 'Meta'; // Command on macOS
    });

    window.addEventListener('keyup', e => {
      if (e.key === 'Meta') {
        this.cmdPressed = false;
      }
    });
  }

  public onClick = () => {
    const { data } = this.props;
    if (data.type === 'folder') {
      Store.goTo(data.id);
    }
  };

  public onMouseEnter = () => this.setState({ hovered: true });

  public onMouseLeave = () => this.setState({ hovered: false });

  public render() {
    const { data } = this.props;
    const { hovered } = this.state;

    let opacity = 1;
    let favicon = data.favicon;

    if (favicon == null) {
      favicon = pageIcon;
      opacity = transparency.light.inactiveIcon;
    }

    if (data.type === 'folder') favicon = folderIcon;

    return (
      <PageItem
        onFocus={() => null}
        onMouseOver={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onClick={this.onClick}
        selected={false}
      >
        <PageItemRemoveIcon visible={hovered} />
        <PageItemIcon style={{ opacity: hovered ? 0 : opacity }} icon={favicon} />
        <Title>{data.title}</Title>
      </PageItem>
    );
  }
}
