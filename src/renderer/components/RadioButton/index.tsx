import * as React from 'react';

import { Container, StyledRadioButton, Circle, Label } from './styles';

export default ({
  selected,
  value,
  onSelect,
  children,
  style,
}: {
  selected?: boolean;
  value?: any;
  onSelect?: (value: any) => void;
  children?: any;
  style?: any;
}) => {
  return (
    <Container style={style} onClick={() => onSelect(value)}>
      <StyledRadioButton className="radio-button" selected={selected}>
        <Circle selected={selected} />
      </StyledRadioButton>
      {children && <Label>{children}</Label>}
    </Container>
  );
};
