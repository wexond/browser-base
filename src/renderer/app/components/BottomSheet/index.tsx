import * as React from 'react';
import { StyledBottomSheet, SmallBar } from './style';

interface Props {
  visible?: boolean;
  children?: any;
  onClick?: any;
  bottom?: number;
  innerRef?: any;
  transition?: boolean;
}

export const BottomSheet = ({
  visible,
  children,
  bottom,
  onClick,
  innerRef,
  transition,
}: Props) => {
  const transform = `translate(-50%, ${
    visible ? `calc(100% - ${bottom}px)` : '100%'
  })`;

  return (
    <StyledBottomSheet
      onClick={onClick}
      style={{
        transform,
        transition: transition ? '0.2s transform' : '',
      }}
      ref={innerRef}
    >
      <SmallBar />
      {children}
    </StyledBottomSheet>
  );
};

BottomSheet.defaultProps = {
  bottom: 0,
};
