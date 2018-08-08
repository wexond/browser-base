import * as tabStyles from './views/app/Tab/styles';

class Components {
  // Tab
  public tab = {
    Root: tabStyles.StyledTab,
    Close: tabStyles.Close,
    // Overlay: tabStyles.Overlay,
    // Title: tabStyles.Title,
    // Icon: tabStyles.Icon,
    // Content: tabStyles.Content,
    // RightBorder: tabStyles.RightBorder,
  };

  [key: string]: any;
}

export default new Components();
