import styled from 'styled-components';
import opacity from '../../../../shared/defaults/opacity';
import typography from '../../../../shared/mixins/typography';

export const Title = styled.div`
  ${typography.subtitle2()};
  opacity: ${opacity.light.secondaryText};
  margin-bottom: 16px;
  margin-top: 32px;
  border-radius: 4px;
  display: table;
  transition: 0.2s background-color;
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
