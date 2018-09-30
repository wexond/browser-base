import styled from 'styled-components';
import { shadows, centerImage } from '@/mixins';
import { icons, transparency } from '@/constants/renderer';

export const StyledBookmarkTile = styled.div`
  padding: 16px 8px;
  border-radius: 4px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

export const Content = styled.div`
  width: 90px;
`;

export const Icon = styled.div`
  position: relative;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.06);
  width: 48px;
  height: 48px;
  left: 50%;
  transform: translateX(-50%);
  ${centerImage('20px', '20px')};
`;

export const PageIcon = styled(Icon)`
  background-image: url(${icons.page});
  opacity: ${transparency.light.inactiveIcon};
`;

export const Title = styled.div`
  text-align: center;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 100%;
  margin-top: 16px;
  font-size: 12px;
`;
