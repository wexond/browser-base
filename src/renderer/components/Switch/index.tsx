import * as React from 'react';

import { StyledSwitch, Thumb } from './styles';
import { BLUE_500 } from '~/renderer/constants';

interface Props {
  color?: string;
  clickable?: boolean;
  value?: boolean;
  onClick?: () => void;
}

export const Switch = ({ color, clickable, value, onClick }: Props) => {
  return (
    <StyledSwitch
      activated={value}
      color={color}
      clickable={clickable}
      onClick={onClick}
    >
      <Thumb activated={value} color={color} />
    </StyledSwitch>
  );
};

(Switch as any).defaultProps = {
  color: BLUE_500,
  defaultValue: false,
};
