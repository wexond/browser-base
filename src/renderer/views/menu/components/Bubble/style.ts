import styled, { css } from 'styled-components';

import { ITheme } from '~/interfaces';
import { centerIcon } from '~/renderer/mixins';

export const StyledBubble = styled.div`
  border-radius: 16px;
  margin-top: 8px;
  padding: 12px 8px;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  ${({ disabled, theme }: { disabled: boolean; theme: ITheme }) => css`
    pointer-events: ${disabled ? 'none' : 'inherit'};
    opacity: ${disabled ? 0.54 : 1};

    &:hover {
      background-color: rgba(255, 255, 255, 0.08);
    }
  `};
`;

export const Icon = styled.div`
  width: 100%;
  height: 100%;
  ${centerIcon(24)};
  transition: 0.2s filter;

  ${({
    invert,
    toggled,
    theme,
  }: {
    invert: boolean;
    toggled?: boolean;
    theme?: ITheme;
  }) => css`
    transition: ${theme.animations ? '0.2s filter' : 'none'};
    filter: ${invert || toggled ? 'invert(100%)' : 'none'};
    opacity: ${toggled ? 1 : 0.54};
  `}
`;

export const Circle = styled.div`
  width: 42px;
  height: 42px;
  overflow: hidden;
  background-color: #212121;
  border-radius: 50%;
  ${centerIcon(32)};

  ${({ theme, toggled }: { theme?: ITheme; toggled?: boolean }) => css`
    transition: ${theme.animations ? '0.2s background-color' : 'none'};

    background-color: ${toggled ? theme.accentColor : 'rgba(0, 0, 0, 0.06)'};
  `}
`;

export const Title = styled.div`
  font-size: 11px;
  text-align: center;
  overflow: hidden;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-top: 16px;
`;
