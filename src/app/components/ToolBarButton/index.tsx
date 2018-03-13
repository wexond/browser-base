import React, { SFC } from "react";

// Enums
import { Icons } from "../../enums";

import { Button, Icon } from "./styles";

interface IProps {
  onClick?: (e?: React.SyntheticEvent<HTMLDivElement>) => void;
  size?: number;
  style?: any;
  icon: Icons;
}

const ToolBarButton: SFC<IProps> = ({ icon, onClick, size, style }) => {
  return (
    <Button onClick={onClick} style={style}>
      <Icon icon={icon} size={size} />
    </Button>
  );
};

ToolBarButton.defaultProps = {
  size: 20
};

export default ToolBarButton;
