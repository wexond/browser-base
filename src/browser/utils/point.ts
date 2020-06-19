import { screen, BrowserWindow } from 'electron';

export const substractArrays = (a: number[], b: number[]) =>
  a.map((x, i) => x - b[i]);

export const objectPointToArray = (obj: any) => [obj.x, obj.y];

const p = (p: any) => (Array.isArray(p) ? p : objectPointToArray(p));

export const getCursorPointRelativeToPoint = (point: number[] | any) =>
  substractArrays(p(screen.getCursorScreenPoint()), p(point));

export const getCursorPointInWindow = (window: BrowserWindow) =>
  getCursorPointRelativeToPoint(p(window.getContentBounds()));
