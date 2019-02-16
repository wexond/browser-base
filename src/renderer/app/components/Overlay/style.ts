import styled, { css } from 'styled-components';
import { body2, subtitle2, centerImage, caption } from '~/shared/mixins';
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
  position: relative;
  display: table;
  ${subtitle2()};
  padding-left: 8px;
  padding-top: 6px;
  padding-right: 24px;
  padding-bottom: 6px;
  margin-left: -8px;
  margin-bottom: 8px;
  border-radius: 50px;
  transition: 0.1s background-color;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

export const HeaderArrow = styled.div`
  ${centerImage('16px', '16px')};
  margin-left: 8px;
  height: 16px;
  width: 16px;
  background-image: url(${icons.forward});
  display: inline-block;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 4px;
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
  transition: 0.1s opacity, 0.2s padding;

  ${({ selected }: { selected: boolean }) => css`
    opacity: ${selected ? 1 : 0.54};
    padding-right: ${selected ? '32px' : '12px'};

    &:hover {
      opacity: 1;
      padding-right: 32px;

      div${TabGroupClose} {
        opacity: 1;
      }

      div${TabGroupContent} {
        max-width: 100%;
      }
    }
  `}
`;

export const TabGroupContent = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const TabGroupClose = styled.div`
  position: absolute;
  right: 8px;
  background-image: url(${icons.close});
  ${centerImage('16px', '16px')};
  width: 16px;
  height: 16px;
  filter: invert(100%);

  ${({ selected }: { selected: boolean }) => css`
    opacity: ${selected ? 1 : 0};
  `}
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
  transition: 0.1s opacity;

  &:hover {
    opacity: 1;
  }
`;

export const Separator = styled.div`
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
  width: 100%;
`;

export const Section = styled.div`
  padding: 24px;
`;

export const Menu = styled.div`
  display: flex;
  margin-left: -16px;
  margin-top: -16px;
  flex-wrap: wrap;
`;

export const Scrollable = styled.div`
  position: absolute;
  overflow-y: scroll;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  &::-webkit-scrollbar {
    display: none;
  }
`;
