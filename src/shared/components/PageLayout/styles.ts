import styled from 'styled-components';
import pages from '../../defaults/pages';

export const StyledPageLayout = styled.div`
  width: 100%;
  height: 100vh;
`;

interface ContentProps {
  toolbarHeight: number;
}

export const Content = styled.div`
  width: calc(100% - ${pages.navDrawerWidth.full}px);
  left: ${pages.navDrawerWidth.full}px;
  position: relative;
  overflow: auto;
  z-index: 10;

  top: ${(props: ContentProps) => props.toolbarHeight}px;
  height: calc(100% - ${props => props.toolbarHeight}px);
`;
