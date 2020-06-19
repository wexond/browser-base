import * as React from 'react';

import { observer } from 'mobx-react-lite';
import {
  StyledMenu,
  StyledItem,
  Icon,
  Text,
  Accelerator,
  Container,
  MenuDivider,
  Table,
} from './style';
import store, { IMenu } from '../../store';
import { IMenuItem } from '~/browser/services/context-menus';
import { ICON_ARROW_RIGHT } from '~/renderer/constants';

const Item = observer(
  ({ data, menuId }: { data: IMenuItem; menuId: string }) => {
    const { onClick, accelerator, title, id, icon } = data;
    const parentMenu = store.menus.find((x) => x.id === menuId);

    let { enabled } = data;

    if (enabled == null) enabled = true;

    const hasSubMenu = Array.isArray(data.submenu) && data.submenu.length > 0;

    const ref = React.useRef<HTMLTableRowElement>(null);

    const onItemClick = React.useCallback(() => {
      // store.contextMenu.visible = false;
      if (onClick && enabled) {
        browser.ipcRenderer.send('menu-click', id);
      }

      store.removeMenu(store.menus.find((x) => x.parentId === menuId)?.id);

      if (hasSubMenu) {
        parentMenu.childId = id;

        const menuRegion = store.getRegion(menuId);

        store.menus.push({
          id,
          menuItems: data.submenu,
          x: menuRegion.left,
          y: ref.current.getBoundingClientRect().top - 4,
          parentId: menuId,
        });
      }
    }, [onClick, hasSubMenu, ref]);

    return (
      <StyledItem
        highlight={hasSubMenu && store.menus.some((x) => x.id === data.id)}
        ref={ref}
        onClick={onItemClick}
        disabled={!enabled}
      >
        <td style={{ paddingLeft: 10, paddingRight: icon ? 10 : 0 }}>
          {icon && (
            <Icon
              className="context-menu-item-icon"
              // iconSize={iconSize}
              iconSize={20}
              disabled={!enabled}
              style={{
                backgroundImage: `url(${icon})`,
              }}
            ></Icon>
          )}
        </td>
        <Text>{title}</Text>
        <Accelerator
          style={{ paddingLeft: accelerator && accelerator !== '' ? 20 : 0 }}
        >
          {accelerator}
        </Accelerator>
        <td
          style={{
            paddingRight: hasSubMenu ? 10 : 0,
            paddingLeft: hasSubMenu ? 0 : 10,
          }}
        >
          {hasSubMenu && (
            <Icon
              className="context-menu-item-icon"
              // iconSize={iconSize}
              iconSize={20}
              disabled={!enabled}
              style={{
                backgroundImage: `url(${ICON_ARROW_RIGHT})`,
                opacity: 0.54,
              }}
            ></Icon>
          )}
        </td>
      </StyledItem>
    );
  },
);

export const Menu = observer(({ data }: { data: IMenu }) => {
  const region = store.getRegion(data.id);

  const measuredRef = React.useRef<HTMLTableElement>(null);

  requestAnimationFrame(() => {
    const { width, height } = measuredRef.current.getBoundingClientRect();

    let x = data.x;

    if (!data.main) {
      const parentRegion = store.getRegion(data.parentId);
      if (!parentRegion) return;

      if (x + parentRegion.width - 4 + width > window.innerWidth)
        x -= width - 4;
      else x += parentRegion.width - 4;
    }

    store.updateRegion(data.id, {
      width,
      height,
      left: data.forceRight
        ? x - width
        : x + width > window.innerWidth
        ? window.innerWidth - width
        : x,
      top:
        data.y + height > window.innerHeight
          ? data.main
            ? data.y - height
            : window.innerHeight - height
          : data.y,
      visible: true,
    });
  });

  return (
    <StyledMenu
      style={{
        left: region.left || 0,
        top: region.top || 0,
      }}
      hideTransition={false}
      visible={true}
    >
      <Table ref={measuredRef}>
        <Container>
          {data.menuItems.map((r, index) => {
            // if (r.hidden) return null;
            if (r.type === 'separator') return <MenuDivider key={index} />;
            return <Item key={r.id} menuId={data.id} data={r} />;
          })}
        </Container>
      </Table>
    </StyledMenu>
  );
});
