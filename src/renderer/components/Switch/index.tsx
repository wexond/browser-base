import * as React from 'react';

import { StyledSwitch, Thumb } from './styles';
import { BLUE_500 } from '~/renderer/constants';

interface Props {
  color?: string;
  clickable?: boolean;
  value?: boolean;
  dense?: boolean;
  onClick?: () => void;
}

export const Switch = ({ color, clickable, value, onClick, dense }: Props) => {
  return (
    <StyledSwitch
      activated={value}
      color={color}
      clickable={clickable}
      dense={dense}
      onClick={onClick}
    >
      <Thumb dense={dense} activated={value} color={color} />
    </StyledSwitch>
  );
};

(Switch as any).defaultProps = {
  color: BLUE_500,
  defaultValue: false,
};
