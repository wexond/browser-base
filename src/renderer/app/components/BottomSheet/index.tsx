import React from 'react';
import { StyledBottomSheet, SmallBar, Content } from './style';

interface Props {
  visible?: boolean;
  children?: any;
}

export const BottomSheet = ({ visible, children }: Props) => {
  return (
    <StyledBottomSheet visible={visible}>
      <SmallBar />
      <Content>{children}</Content>
    </StyledBottomSheet>
  );
};
