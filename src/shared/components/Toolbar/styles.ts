import styled from 'styled-components';
import { typography } from 'nersent-ui';
import pages from '../../defaults/pages';

interface ToolbarProps {
  height: number;
}

export const StyledToolbar = styled.div`
  width: calc(100% - ${pages.navDrawerWidth.full}px);
  max-height: ${pages.toolbarHeight}px;
  min-height: 64px;
  position: fixed;
  z-index: 999;
  top: 0;
  left: ${pages.navDrawerWidth.full}px;
  display: flex;
  align-items: center;
  user-select: none;
  background-color: #f5f5f5;
  transition: 0.2s box-shadow;

  height: ${(props: ToolbarProps) => props.height}px;
  box-shadow: ${props =>
    (props.height < pages.toolbarHeight ? '0px 2px 15px 2px rgba(0, 0, 0, 0.2)' : 'none')};
`;

interface TitleProps {
  smallFontSize: boolean;
}

export const Title = styled.div`
  left: 64px;
  font-size: ${(props: TitleProps) => (props.smallFontSize ? 24 : 32)}px;
  position: absolute;
  transition: 0.2s font-size;
  opacity: 0.87;
  ${typography.robotoMedium()};
`;

export const Line = styled.div`
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 128px);
  height: 1px;
  background: rgba(0, 0, 0, 0.12);
  position: absolute;
  bottom: 0;
`;
