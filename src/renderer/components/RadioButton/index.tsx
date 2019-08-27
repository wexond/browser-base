import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Container, Radio, Label, Root, Circle } from './styles';
import { colors } from '~/renderer/constants';

interface Props {
  selected: boolean;
}

export const RadioButton = observer(({ selected }: Props) => {
  return (
    <Container>
      <Root>
        <Radio defaultChecked={selected} />
        <Circle selected={selected} />
      </Root>
    </Container>
  );
});
