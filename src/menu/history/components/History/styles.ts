import styled from 'styled-components';
import typography from '../../../../shared/mixins/typography';
import opacity from '../../../../shared/defaults/opacity';

export const Content = styled.div`
  max-width: 640px;
  width: calc(100% - 64px);
  padding-bottom: 32px;
  left: 50%;
  position: relative;
  transform: translateX(-50%);
`;

export const Toolbar = styled.div`
  height: 56px;
  border-bottom: 1px solid rgba(0, 0, 0, ${opacity.light.dividers});
  box-sizing: border-box;
  background-color: #fff;
  position: fixed;
  z-index: 999;
  top: 0;
  width: calc(100% - 300px);
`;

export const Title = styled.div`
  ${typography.robotoMedium()};
  font-size: 32px;
  opacity: ${opacity.light.primaryText};
  margin-top: 56px;
  margin-left: 64px;
`;
