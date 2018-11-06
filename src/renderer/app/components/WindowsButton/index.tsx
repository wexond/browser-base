import * as React from 'react';

import { Button, Icon } from './styles';

interface Props {
  icon: string;
  isClose?: boolean;
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default ({ icon, onClick, isClose }: Props) => (
  <Button isClose={isClose} icon={icon} onClick={onClick}>
    <Icon isClose={isClose} icon={icon} />
  </Button>
);
