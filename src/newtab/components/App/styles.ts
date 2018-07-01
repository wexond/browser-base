import styled from 'styled-components';

import images from '../../../shared/mixins/images';
import typography from '../../../shared/mixins/typography';
import opacity from '../../../shared/defaults/opacity';

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
  flex-flow: row;
  position: relative;
  padding-top: 24px;
  padding-bottom: 24px;
  background-color: #f5f5f5;
  flex-wrap: wrap;

  opacity: ${({ visible }: ContentProps) => (visible ? 1 : 0)};
`;

export const CardsContainer = styled.div`
  & .weather-card {
    position: sticky;
    top: 24px;
  }
`;

export const Credits = styled.div`
  width: 100%;
  align-items: center;
  position: fixed;
  padding-top: 4px;
  padding-bottom: 4px;
  bottom: 0px;
  left: 8px;
  font-size: 12px;
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
  background-color: #f5f5f5;

  & a {
    transition: 0.2s color;
  }

  & a:hover {
    color: rgba(0, 0, 0, ${opacity.light.primaryText});
  }
`;

export const Column = styled.div`
  display: flex;
  flex-flow: column;
  margin-right: 32px;
  align-items: flex-start;

  &:last-child {
    margin-right: 0px;
  }
`;
