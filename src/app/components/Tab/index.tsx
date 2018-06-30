import { observer } from 'mobx-react';
import React from 'react';
import tabAnimations from '../../defaults/tab-animations';
import TabModel from '../../models/tab';
import Workspace from '../../models/workspace';
import Store from '../../store';
import { closeWindow } from '../../utils/window';

import Ripples from '../../../shared/components/Ripples';
import colors from '../../../shared/defaults/colors';
import components from '../../components';

export interface TabProps {
  key: number;
  tab: TabModel;
  workspace: Workspace;
  selected: boolean;
  onMouseDown?: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTabMouseDown?: (e?: React.MouseEvent<HTMLDivElement>, tab?: TabModel) => void;
  style?: any;
}

@observer
export default class Tab extends React.Component<TabProps, {}> {
  private ripples: Ripples;

  private iconRipples: Ripples;

  private tab: HTMLDivElement;

  public componentDidMount() {
    const { tab } = this.props;

    const frame = () => {
      if (this.tab != null) {
        const boundingRect = this.tab.getBoundingClientRect();
        if (
          Store.mouse.x >= boundingRect.left
          && Store.mouse.x <= boundingRect.left + this.tab.offsetWidth
          && Store.mouse.y >= boundingRect.top
          && Store.mouse.y <= boundingRect.top + this.tab.offsetHeight
        ) {
          if (!tab.hovered && !Store.draggingTab) {
            tab.hovered = true;
          }
        } else if (tab.hovered) {
          tab.hovered = false;
        }
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  }

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const {
      selected, tab, workspace, onTabMouseDown,
    } = this.props;
    const { pageX, pageY } = e;

    Store.addressBar.canToggle = selected;
    setTimeout(() => {
      if (tab !== workspace.getSelectedTab()) {
        workspace.selectTab(tab);
      }
    });
    onTabMouseDown(e, tab);
    this.ripples.makeRipple(pageX, pageY);
  };

  public onMouseUp = () => {
    this.ripples.removeRipples();
  };

  public onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    this.iconRipples.makeRipple(e.pageX, e.pageY);
  };

  public onCloseMouseUp = () => {
    this.ripples.removeRipples();
  };

  public onClick = () => {
    if (Store.addressBar.canToggle) {
      Store.addressBar.toggled = true;
    }
  };

  public onClose = (e: React.MouseEvent<HTMLDivElement>) => {
    const { workspace, tab, selected } = this.props;

    e.stopPropagation();

    const tabIndex = workspace.tabs.indexOf(tab);
    const page = Store.getPageById(tab.id);

    Store.pages.splice(Store.pages.indexOf(page), 1);

    if (selected) {
      if (tabIndex + 1 < workspace.tabs.length && !workspace.tabs[tabIndex + 1].isRemoving) {
        workspace.selectedTab = workspace.tabs[tabIndex + 1].id;
      } else if (tabIndex - 1 >= 0 && !workspace.tabs[tabIndex - 1].isRemoving) {
        workspace.selectedTab = workspace.tabs[tabIndex - 1].id;
      } else if (Store.workspaces.list.length === 1) {
        closeWindow();
      }
    }

    workspace.resetTimer();

    tab.isRemoving = true;
    if (workspace.tabs.length - 1 === tabIndex) {
      const previousTab = workspace.tabs[tabIndex - 1];
      tab.setLeft(previousTab.getNewLeft() + previousTab.getWidth(), true);
      workspace.updateTabsBounds();
    }

    tab.setWidth(0, true);

    setTimeout(() => {
      workspace.removeTab(tab);
    }, tabAnimations.left.duration * 1000);

    workspace.setTabsPositions();

    requestAnimationFrame(() => {
      workspace.tabsIndicator.moveToTab(workspace.getSelectedTab());
    });
  };

  public render() {
    const {
      selected, tab, workspace, children,
    } = this.props;

    const {
      title, isRemoving, hovered, dragging, favicon,
    } = tab;

    let rightBorderVisible = true;

    const tabIndex = workspace.tabs.indexOf(tab);

    if (
      hovered
      || selected
      || ((tabIndex + 1 !== workspace.tabs.length
        && (workspace.tabs[tabIndex + 1].hovered
          || workspace.selectedTab === workspace.tabs[tabIndex + 1].id))
        || tabIndex === workspace.tabs.length - 1)
    ) {
      rightBorderVisible = false;
    }

    const {
      Root, Content, Icon, Title, Close, Overlay, RightBorder,
    } = components.tab;

    return (
      <Root
        selected={selected}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onClick={this.onClick}
        isRemoving={isRemoving}
        visible={!Store.addressBar.toggled}
        innerRef={(r: HTMLDivElement) => {
          this.tab = r;
          tab.tab = r;
        }}
      >
        <Content hovered={hovered}>
          <Icon favicon={favicon.trim()} />
          <Title selected={selected} favicon={favicon}>
            {title}
          </Title>
        </Content>
        <Close
          onMouseDown={this.onCloseMouseDown}
          onMouseUp={this.onCloseMouseUp}
          onClick={this.onClose}
          hovered={hovered}
        >
          <Ripples
            icon
            ref={r => (this.iconRipples = r)}
            color="#000"
            parentWidth={16}
            parentHeight={16}
            size={28}
            rippleTime={0.6}
            initialOpacity={0.1}
          />
        </Close>
        {children}
        <Overlay hovered={hovered} selected={selected} />
        <Ripples rippleTime={0.6} ref={r => (this.ripples = r)} color={colors.blue['500']} />
        <RightBorder visible={rightBorderVisible} />
      </Root>
    );
  }
}
