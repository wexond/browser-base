import styled, { css } from 'styled-components';
import { body2, subtitle2, centerImage } from '~/shared/mixins';
import { colors } from '~/renderer/constants';
import { icons } from '../../constants';

export const StyledOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  transition: 0.2s opacity;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const HeaderText = styled.div`
  display: flex;
  align-items: center;
  ${subtitle2()};
  padding-bottom: 16px;
`;

export const HeaderArrow = styled.div`
  ${centerImage('16px', '16px')};
  margin-left: 8px;
  height: 16px;
  width: 16px;
  background-image: url(${icons.forward});
`;

export const StyledTabGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 32px;
  color: white;
  border-radius: 50px;
  margin-right: 8px;
`;

export const StyledTabGroups = styled.div`
  display: flex;
  align-items: center;
`;

export const AddTabGroup = styled.div`
  width: 32px;
  height: 32px;
  border: 1px solid black;
  opacity: 0.54;
  border-radius: 50px;
  ${centerImage('18px', '18px')};
  background-image: url(${icons.add});
  transition: 0.2s opacity;

  &:hover {
    opacity: 1;
  }
`;

export const SelectedIndicator = styled.div`
  background-color: rgba(0, 0, 0, 0.54);
  width: 5px;
  height: 5px;
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 50%;

  display: ${({ visible }: { visible: boolean }) =>
    visible ? 'block' : 'none'};
`;

export const Separator = styled.div`
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
  width: 100%;
  margin-top: 16px;
`;

export const Section = styled.div`
  padding: 0 24px;
`;
