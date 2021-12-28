import styled, { css } from 'styled-components';
import { BLUE_500, ICON_PAGE, ICON_MORE } from '~/renderer/constants';
import { centerIcon } from '~/renderer/mixins';
import { ITheme } from '~/interfaces';

export const StyledDownloadItem = styled.div`
  height: 64px;
  background-color: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  display: flex;
  align-items: center;
  position: relative;
  margin-top: 8px;
  transition: 0.1s background-color, 0.1s border;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['dialog.lightForeground']
      ? `rgba(255, 255, 255, 0.04)`
      : `rgba(0, 0, 0, 0.02)`};

    &:hover {
      background-color: ${theme['dialog.lightForeground']
        ? `rgba(255, 255, 255, 0.06)`
        : `rgba(0, 0, 0, 0.04)`};
    }
  `}

  &:first-child {
    margin-top: 0;
  }
`;

export const Title = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  ${({ canceled }: { canceled?: boolean }) => css`
    text-decoration: ${canceled ? 'line-through' : 'none'};
  `}
`;

export const SecondaryText = styled.div`
  opacity: 0.54;
  font-size: 11px;
  margin-top: 4px;
`;

export const Progress = styled.div`
  height: 5px;
  background-color: ${BLUE_500};
  border-radius: 16px;
`;

export const ProgressBackground = styled.div`
  height: 5px;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  overflow: hidden;
  margin-top: 4px;
  flex: 1;

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['dialog.lightForeground']
      ? `rgba(255, 255, 255, 0.12)`
      : `rgba(0, 0, 0, 0.12)`};
  `}
`;

export const Info = styled.div`
  display: flex;
  flex-flow: column;
  justify-content: center;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const Icon = styled.div`
  width: 24px;
  height: 24px;
  ${centerIcon()};
  background-image: url(${ICON_PAGE});
  margin-right: 16px;
  opacity: 0.54;
  margin-left: 16px;

  ${({ theme }: { theme?: ITheme }) => css`
    filter: ${theme['dialog.lightForeground'] ? 'invert(100%)' : ''};
  `}
`;

export const MoreButton = styled.div`
  width: 36px;
  height: 36px;
  ${centerIcon(20)};
  background-image: url(${ICON_MORE});

  opacity: 0.54;
  margin-right: 8px;
  border-radius: 6px;
  transition: 0.1s background-color;

  ${({ theme, toggled }: { theme?: ITheme; toggled?: boolean }) => css`
    filter: ${theme['dialog.lightForeground'] ? 'invert(100%)' : ''};
    background-color: ${toggled ? 'rgba(0, 0, 0, 0.08)' : 'transparent'};
  `}

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;

export const Separator = styled.div`
  height: 48px;
  width: 1px;
  margin-left: 16px;
  margin-right: 8px;
  background-color: rgba(0, 0, 0, 0.12);

  ${({ theme }: { theme?: ITheme }) => css`
    background-color: ${theme['dialog.lightForeground']
      ? 'rgba(255, 255, 255, 0.12)'
      : 'rgba(0, 0, 0, 0.12)'};
  `}
`;
