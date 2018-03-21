import { observer } from 'mobx-react'; // eslint-disable-line no-unused-vars
import React from 'react';
import { Ripples, colors } from 'nersent-ui';

// Constants and defaults
import { TAB_MAX_WIDTH } from '../../constants/design';
import tabAnimations from '../../defaults/tab-animations';

// Utils
import { closeWindow } from '../../utils/window';

// Styles
import { Close, StyledTab, Title } from './styles';

// Models
import Tab from '../../models/tab';
import TabGroup from '../../models/tab-group';

import Store from '../../store';

interface IProps {
  key: number;
  tab: Tab;
  tabGroup: TabGroup;
  selected: boolean;
  onMouseDown: (e: React.MouseEvent<HTMLDivElement>) => void;
  styles?: any;
}

@observer
export default class extends React.Component<IProps, {}> {
  private ripples: Ripples;
  private iconRipples: Ripples;
  private tab: HTMLDivElement;

  public componentDidMount() {
    const { tab } = this.props;

    const frame = () => {
      if (this.tab != null) {
        const boundingRect = this.tab.getBoundingClientRect();
        if (
          Store.mouse.x >= boundingRect.left &&
          Store.mouse.x <= boundingRect.left + this.tab.offsetWidth &&
          Store.mouse.y >= boundingRect.top &&
          Store.mouse.y <= boundingRect.top + this.tab.offsetHeight
        ) {
          if (!tab.hovered) {
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

  public shouldComponentUpdate(nextProps: any) {
    const { tab, selected } = this.props;
    if (
      nextProps.left !== tab.left ||
      nextProps.width !== tab.width ||
      selected !== nextProps.selected
    ) {
      return true;
    }
    return false;
  }

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { selected, tab, tabGroup } = this.props;

    this.ripples.makeRipple(e.pageX, e.pageY);
    Store.addressBar.canToggle = selected;
    tabGroup.selectTab(tab);

    this.props.onMouseDown(e);
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
    const { tabGroup, tab, selected } = this.props;

    e.stopPropagation();

    if (selected) {
      const tabIndex = tabGroup.tabs.indexOf(tab);

      if (tabIndex + 1 < tabGroup.tabs.length && !tabGroup.tabs[tabIndex + 1].isRemoving) {
        tabGroup.selectedTab = tabGroup.tabs[tabIndex + 1].id;
      } else if (tabIndex - 1 >= 0 && !tabGroup.tabs[tabIndex - 1].isRemoving) {
        tabGroup.selectedTab = tabGroup.tabs[tabIndex - 1].id;
      } else if (Store.tabGroups.length === 1) {
        closeWindow();
      }
    }

    if (tabGroup.getScrollingMode() || tab.width === TAB_MAX_WIDTH) {
      tab.isRemoving = true;
      tab.animate('width', 0);

      tabGroup.updateTabsBounds();

      setTimeout(() => {
        tabGroup.removeTab(tab);
      }, tabAnimations.left.duration * 1000);
    } else {
      tabGroup.removeTab(tab);
      tabGroup.updateTabsBounds();
    }

    requestAnimationFrame(() => {
      tabGroup.line.moveToTab(tabGroup.getSelectedTab());
    });
  };

  public render() {
    const { selected, tab } = this.props;
    const {
      left, width, title, isRemoving, hovered, dragging,
    } = tab;

    return (
      <StyledTab
        selected={selected}
        style={{
          transform: `translateX(${left}px)`,
          width,
        }}
        hovered={hovered}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
        onClick={this.onClick}
        isRemoving={isRemoving}
        dragging={dragging}
        visible={!Store.addressBar.toggled}
        innerRef={r => (this.tab = r)}
      >
        <Title hovered={hovered}>{title}</Title>
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
            size={32}
            rippleTime={0.6}
            initialOpacity={0.1}
          />
        </Close>
        <Ripples rippleTime={0.6} ref={r => (this.ripples = r)} color={colors.blue['500']} />
      </StyledTab>
    );
  }
}
