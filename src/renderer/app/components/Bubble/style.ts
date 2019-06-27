import styled, { css } from 'styled-components';
import { caption, centerIcon } from '~/shared/mixins';
import { Theme } from '../../models/theme';

export const StyledBubble = styled.div`
  border-radius: 16px;
  margin-top: 8px;
  padding: 16px 8px;
  transition: 0.1s background-color;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  ${({ disabled, theme }: { disabled: boolean; theme: Theme }) => css`
    pointer-events: ${disabled ? 'none' : 'inherit'};
    opacity: ${disabled ? 0.54 : 1};

    &:hover {
      background-color: ${theme['overlay.foreground'] === 'light'
        ? 'rgba(255, 255, 255, 0.08)'
        : 'rgba(0, 0, 0, 0.04)'};
    }
  `};
`;

export const Icon = styled.div`
  width: 100%;
  height: 100%;
  margin-bottom: 16px;
  ${centerIcon(32)};
  transition: 0.2s filter;

  ${({ invert, toggled }: { invert: boolean; toggled?: boolean }) => css`
    filter: ${invert || toggled ? 'invert(100%)' : 'none'};
  `}
`;

export const Circle = styled.div`
  width: 56px;
  height: 56px;
  overflow: hidden;
  background-color: #212121;
  border-radius: 50%;
  margin-bottom: 16px;
  ${centerIcon(32)};
  transition: 0.2s background-color;

  ${({ theme, toggled }: { theme?: Theme; toggled?: boolean }) => css`
    background-color: ${toggled
      ? theme.accentColor
      : theme['overlay.foreground'] === 'light'
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(0, 0, 0, 0.08)'};
  `}
`;

export const Title = styled.div`
  font-size: 13px;
  text-align: center;
  overflow: hidden;
  max-width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
`;
