import React from 'react';
import { Button, Icon } from './styles';
import { Icons } from '../../../shared/enums';

interface IProps {
  icon: Icons;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default ({ icon, onClick }: IProps) => (
  <Button icon={icon} onClick={onClick}>
    <Icon icon={icon} />
  </Button>
);
