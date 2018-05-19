import styled from 'styled-components';

import opacity from '../../../../shared/defaults/opacity';
import typography from '../../../../shared/mixins/typography';

export const StyledItem = styled.div`
  display: flex;
  font-size: 15px;
  padding: 12px 16px 12px 16px;

  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.div`
  opacity: ${opacity.light.primaryText};
  ${typography.robotoMedium};
`;

export const Content = styled.div`
  text-align: right;

  opacity: ${opacity.light.secondaryText};
`;
