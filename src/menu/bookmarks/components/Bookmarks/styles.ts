import styled from 'styled-components';
import typography from '../../../../shared/mixins/typography';
import opacity from '../../../../shared/defaults/opacity';

export const Content = styled.div`
  width: calc(100% - 64px);
  max-width: 640px;
  margin: 0 auto;
`;

export const Folders = styled.div`
  margin-top: 16px;
  display: flex;
  border-radius: 4px;
`;

export const Items = styled.div`
  margin-top: 16px;
  display: flex;
  flex-flow: column;
  overflow: hidden;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08), 0 1px 3px 1px rgba(60, 64, 67, 0.16);
`;

export const SubTitle = styled.div`
  font-size: 14px;
  opacity: ${opacity.light.secondaryText};
  margin-top: 32px;

  ${typography.robotoMedium()};
`;
