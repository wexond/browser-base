import * as React from 'react';
import { StyledBottomSheet, SmallBar, Content } from './style';

interface Props {
  visible?: boolean;
  children?: any;
  onClick?: any;
}

export const BottomSheet = ({ visible, children, onClick }: Props) => {
  return (
    <StyledBottomSheet onClick={onClick} visible={visible}>
      <SmallBar />
      <Content>{children}</Content>
    </StyledBottomSheet>
  );
};
