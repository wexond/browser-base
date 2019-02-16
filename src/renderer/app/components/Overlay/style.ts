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

  &:after {
    content: '';
    background-color: rgba(255, 255, 255, 0.2);
    opacity: 0;
    position: absolute;
    left: 0;
    border-radius: 50px;
    top: 0;
    right: 0;
    bottom: 0;
    transition: 0.1s opacity;
  }

  &:hover {
    &:after {
      opacity: 1;
    }
  }
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

export const SelectedIndicator = styled.div`
  background-color: rgba(0, 0, 0, 0.54);
  width: 5px;
  height: 5px;
  position: absolute;
  bottom: -10px;
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

const width = 700;
const itemsPerRow = 5;
const size = (width - 48 - (itemsPerRow - 1) * 16) / itemsPerRow;

export const StyledMenuItem = styled.div`
  border-radius: 8px;
  min-width: ${size}px;
  max-width: ${size}px;
  height: ${size}px;
  margin-left: 16px;
  margin-top: 16px;
  transition: 0.1s background-color;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

export const Icon = styled.div`
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.54);
  width: 42px;
  height: 42px;
  margin-bottom: 16px;
`;

export const Title = styled.div`
  ${caption()};
  text-align: center;
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

export const SearchBox = styled.div`
  position: absolute;
  top: 15%;
  left: 50%;
  height: 42px;
  width: 700px;
  z-index: 2;
  background-color: white;
  border-radius: 30px;
  transform: translateX(-50%);
  display: flex;
`;

export const SearchIcon = styled.div`
  ${centerImage('16px', '16px')};
  background-image: url(${icons.search});
  height: 100%;
  min-width: 16px;
  margin-left: 16px;
`;

export const Input = styled.input`
  height: 100%;
  flex: 1;
  background-color: transparent;
  border: none;
  outline: none;
  color: black;
  margin-left: 16px;
`;
