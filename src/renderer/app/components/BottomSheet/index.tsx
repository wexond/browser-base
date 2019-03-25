import * as React from 'react';
import { StyledBottomSheet, SmallBar } from './style';

interface Props {
  visible?: boolean;
  children?: any;
  onClick?: any;
  innerRef?: any;
  bottom?: number;
}

export const BottomSheet = ({
  visible,
  children,
  onClick,
  innerRef,
  bottom,
}: Props) => {
  return (
    <StyledBottomSheet
      style={{ top: visible ? `calc(100% - ${bottom}px)` : '100%' }}
      onClick={onClick}
      ref={innerRef}
    >
      <SmallBar />
      {children}
    </StyledBottomSheet>
  );
};
