import store from '@app/store';
import ContextMenu from '@/components/ContextMenu';

export const getContextMenuPos = (element: ContextMenu) => {
  // Calculate new menu position
  // using cursor x, y and
  // width, height of the menu.
  const x = store.mouse.x;
  const y = store.mouse.y;

  // By default it opens menu from upper left corner.
  let left = x;
  let top = y;

  const width = 3 * 64;
  const height = element.getHeight();

  // Open menu from right corner.
  if (left + width > window.innerWidth) {
    left = x - width;
  }

  // Open menu from bottom corner.
  if (top + height > window.innerHeight) {
    top = y - height;
  }

  if (top < 0) {
    top = 96;
  }

  return { x: left, y: top };
};
