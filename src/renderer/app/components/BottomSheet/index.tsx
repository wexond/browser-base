import * as React from 'react';
import { StyledBottomSheet, SmallBar } from './style';

interface Props {
  visible?: boolean;
  children?: any;
  onClick?: any;
  innerRef?: any;
}

export const BottomSheet = ({
  visible,
  children,
  onClick,
  innerRef,
}: Props) => {
  return (
    <StyledBottomSheet onClick={onClick} ref={innerRef}>
      <SmallBar />
      {children}
    </StyledBottomSheet>
  );
};

BottomSheet.defaultProps = {
  bottom: 0,
};
