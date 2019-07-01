import styled from 'styled-components';

import { robotoLight } from '~/renderer/mixins';
import { Content } from '../../../style';

export const Section = styled(Content)`
  padding-left: 32px;
`

export const Title = styled.div`
  font-size: 24px;
  padding-top: 24px;
  padding-bottom: 16px;
  ${robotoLight()};
`;
