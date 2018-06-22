import styled from 'styled-components';
import shadows from '../../../../shared/mixins/shadows';
import opacity from '../../../../shared/defaults/opacity';
import typography from '../../../../shared/mixins/typography';

export const Title = styled.div`
  font-size: 16px;
  ${typography.robotoRegular()};
  opacity: ${opacity.light.primaryText};
  letter-spacing: 0.0125rem * 0.15;
  margin-bottom: 16px;
  margin-top: 32px;
`;

export const Items = styled.div`
  display: flex;
  flex-flow: column;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08), 0 1px 3px 1px rgba(60, 64, 67, 0.16);
  background-color: #fff;
  overflow: hidden;
  border-radius: 4px;
  transition: 0.2s box-shadow;
`;
