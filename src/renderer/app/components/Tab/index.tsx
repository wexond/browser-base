import { observer } from 'mobx-react';
import * as React from 'react';

import Preloader from '~/renderer/components/Preloader';
import Ripple from '~/renderer/components/Ripple';
import { Tab } from '~/renderer/app/models';
import store from '~/renderer/app/store';
import { colors } from '~/renderer/constants';
import {
  StyledTab,
  StyledContent,
  StyledIcon,
  StyledTitle,
  StyledClose,
  StyledBorder,
} from './style';

const removeTab = (tab: Tab) => () => {
  tab.close();
};

const onMouseDown = (tab: Tab) => (e: React.MouseEvent<HTMLDivElement>) => {
  const { pageX, pageY } = e;

  tab.select();

  store.tabsStore.lastMouseX = 0;
  store.tabsStore.isDragging = true;
  store.tabsStore.mouseStartX = pageX;
  store.tabsStore.tabStartX = tab.left;

  store.tabsStore.lastScrollLeft =
    store.tabsStore.containerRef.current.scrollLeft;
};

const onMouseEnter = (tab: Tab) => () => {
  if (!store.tabsStore.isDragging) {
    tab.hovered = true;
  }
};

const onMouseLeave = (tab: Tab) => () => {
  tab.hovered = false;
};

const Content = observer(({ tab }: { tab: Tab }) => {
  return (
    <StyledContent collapsed={tab.isExpanded}>
      {!tab.loading && tab.favicon !== '' && (
        <StyledIcon
          isIconSet={tab.favicon !== ''}
          style={{ backgroundImage: `url(${tab.favicon})` }}
        />
      )}
      {tab.loading && <Preloader thickness={6} size={16} />}
      <StyledTitle selected={tab.isSelected} isIcon={tab.isIconSet}>
        {tab.title}
      </StyledTitle>
    </StyledContent>
  );
});

const Close = observer(({ tab }: { tab: Tab }) => {
  return (
    <StyledClose
      // onMouseDown={}
      onClick={removeTab(tab)}
      visible={tab.isExpanded}
    />
  );
});

const Border = observer(({ tab }: { tab: Tab }) => {
  return <StyledBorder visible={tab.borderVisible} />;
});

export default observer(({ tab }: { tab: Tab }) => {
  return (
    <StyledTab
      selected={tab.isSelected}
      hovered={tab.hovered}
      onMouseDown={onMouseDown(tab)}
      onMouseEnter={onMouseEnter(tab)}
      onMouseLeave={onMouseLeave(tab)}
      isClosing={tab.isClosing}
      ref={tab.ref}
    >
      <Content tab={tab} />
      <Close tab={tab} />
      <Border tab={tab} />
    </StyledTab>
  );
});

/*@observer
class extends React.Component<, {}> {
  private ripple = React.createRef<Ripple>();

  public componentDidMount() {
    const { tab } = this.props;
  }

  public onMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const { pageX, pageY } = e;
    const { tab } = this.props;

    tab.select();

    store.tabsStore.lastMouseX = 0;
    store.tabsStore.isDragging = true;
    store.tabsStore.mouseStartX = pageX;
    store.tabsStore.tabStartX = tab.left;

    store.tabsStore.lastScrollLeft =
      store.tabsStore.containerRef.current.scrollLeft;

    this.ripple.current.makeRipple(pageX, pageY);
  };

  public onCloseMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  public onCloseClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    this.props.tab.close();
  };

  public render() {
    const { tab } = this.props;
    const { title, isClosing, hovered, favicon, loading, isSelected } = tab;

    const rightBorderVisible = true;

    if (
      hovered ||
      isSelected ||
      (tabIndex + 1 !== tabs.length &&
        (tabs[tabIndex + 1].hovered ||
          store.tabsStore.selectedTabId === tabs[tabIndex + 1].id))
    ) {
      rightBorderVisible = false;
    }

    return
  }
}
*/
