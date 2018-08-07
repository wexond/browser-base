export interface KeyBinding {
  key?: string;
  keyMinRange?: number;
  keyMaxRange?: number;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  command?: string;
  isRange?: boolean;
}
