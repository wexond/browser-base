import styled, { css } from 'styled-components';
import { transparency } from '~/defaults';
import { EASE_FUNCTION } from '~/constants';
import { centerBoth, robotoRegular, centerHorizontal } from '@mixins';

export const StyledSlider = styled.div`
  width: 100%;
  height: 2px;
  position: relative;
  cursor: pointer;
`;

export interface TrackProps {
  color: string;
  thumbAnimation?: boolean;
  discrete?: boolean;
}

export const Track = styled.div`
  height: 2px;
  position: absolute;
  top: 0;
  left: 0;

  ${({ color }: TrackProps) => css`
    background-color: ${color};
  `};
`;

export const InactiveTrack = styled(Track)`
  width: 100%;
  opacity: ${transparency.light.disabledControl};
`;

export const ActiveTrack = styled(Track)`
  width: 50%;
  transition: 0.2s opacity;

  ${({ thumbAnimation, discrete }: TrackProps) => css`
    opacity: ${thumbAnimation ? 0 : 1};
    transition: ${discrete ? `0.15s width ${EASE_FUNCTION}` : 'unset'};
  `};
`;

export const ThumbContainer = styled.div`
  width: 32px;
  height: 32px;
  position: absolute;
  top: 50%;
  transform: translateX(-50%) translateY(-50%);
  position: relative;
  cursor: pointer;

  ${({ discrete }: { discrete: boolean }) => css`
    transition: ${discrete ? `0.15s left ${EASE_FUNCTION}` : 'unset'};
  `};

  &:hover .thumb-hover {
    width: 32px;
    height: 32px;
  }
`;

export const ThumbHover = styled.div`
  width: 0px;
  height: 0px;
  border-radius: 100%;
  position: absolute;
  transition: 0.2s width, 0.2s height;
  opacity: ${transparency.light.dividers};

  ${centerBoth()};

  ${({ color }: { color: string }) => css`
    background-color: ${color};
  `};
`;

export interface ThumbProps {
  color: string;
  thumbAnimation: boolean;
}

export const Thumb = styled.div`
  border-radius: 100%;
  position: absolute;
  transition: 0.15s width, 0.15s height;

  ${centerBoth()};

  ${({ color, thumbAnimation }: ThumbProps) => css`
    background-color: ${color};
    width: ${thumbAnimation ? 0 : 12}px;
    height: ${thumbAnimation ? 0 : 12}px;
  `};
`;

export const TicksContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 2px;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
`;

export interface TickProps {
  color: string;
}

export const Tick = styled.div`
  width: 2px;
  height: 2px;
  position: relative;

  ${({ color }: { color: string }) => css`
    background-color: ${color};
  `};
`;

export const TickValue = styled.div`
  width: 32px;
  text-align: center;
  position: relative;
  white-space: nowrap;
  font-size: 12px;
  margin-top: 16px;
  color: rgba(0, 0, 0, ${transparency.light.secondaryText});

  ${robotoRegular()};
  ${centerHorizontal()};
`;
