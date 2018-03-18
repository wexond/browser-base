import React from 'react';

// Enums
import { Icons } from '../../enums';

// Styles
import { Button, Icon } from './styles';

interface IProps {
  icon: Icons;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default ({ icon, onClick }: IProps) => (
  <Button icon={icon} onClick={onClick}>
    <Icon icon={icon} />
  </Button>
);
