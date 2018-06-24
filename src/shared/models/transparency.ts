import opacity from '../defaults/opacity';

export class TransparencyComponent {
  public light = {
    disabled: opacity.light.disabledControl,
    inactive: opacity.light.inactiveControl,
    active: 1,
  };

  public dark = {
    disabled: opacity.dark.disabledControl,
    inactive: opacity.dark.inactiveControl,
    active: 1,
  };
}

export class TransparencyText {
  public light = {
    disabled: opacity.light.disabledText,
    inactive: opacity.light.secondaryText,
    active: opacity.light.primaryText,
  };

  public dark = {
    disabled: opacity.dark.disabledText,
    inactive: opacity.dark.secondaryText,
    active: opacity.dark.primaryText,
  };
}
