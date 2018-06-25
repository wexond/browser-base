import styled from 'styled-components';

import images from '../../../shared/mixins/images';
import typography from '../../../shared/mixins/typography';

export const StyledApp = styled.div`
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding-left: 32px;
  padding-right: 32px;
  background-color: #f5f5f5;
`;

export interface ContentProps {
  visible: boolean;
}

export const Content = styled.div`
  max-width: 960px;
  width: 100%;
  height: 500px;
  margin: 32px auto;
  transition: 0.2s opacity;

  opacity: ${({ visible }: ContentProps) => (visible ? 1 : 0)};
`;
