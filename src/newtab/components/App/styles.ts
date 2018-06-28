import styled from 'styled-components';

import images from '../../../shared/mixins/images';
import typography from '../../../shared/mixins/typography';

export const StyledApp = styled.div`
  width: 100%;
  height: 100vh;
`;

export interface ContentProps {
  visible: boolean;
}

export const Content = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  padding-top: 24px;
  background-color: #f5f5f5;

  opacity: ${({ visible }: ContentProps) => (visible ? 1 : 0)};
`;

export const CardsContainer = styled.div`
  & .weather-card {
    position: sticky;
    top: 24px;
  }
`;
