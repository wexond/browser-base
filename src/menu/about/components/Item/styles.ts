import styled from 'styled-components';
import opacity from '../../../../shared/defaults/opacity';
import typography from '../../../../shared/mixins/typography';

export const StyledItem = styled.div`
  display: flex;
  font-size: 14px;
  height: 48px;
  justify-content: space-between;
  align-items: center;
`;

export const Title = styled.div`
  margin-left: 16px;
  opacity: ${opacity.light.primaryText};

  ${typography.subtitle2()};
`;

export const Content = styled.div`
  text-align: right;
  margin-right: 16px;
  opacity: ${opacity.light.secondaryText};

  ${typography.body2()};
`;
