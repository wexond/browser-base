import styled, { css } from 'styled-components';
import { body2, subtitle2, centerImage, caption } from '~/shared/mixins';
import { colors } from '~/renderer/constants';
import { icons } from '../../constants';

export const StyledOverlay = styled.div`
  background-color: rgba(0, 0, 0, 0.9);
  color: white;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 9999;
  transition: 0.15s opacity;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const HeaderText = styled.div`
  position: relative;
  display: table;
  font-size: 16px;
  padding-left: 8px;
  padding-top: 6px;
  padding-right: 24px;
  padding-bottom: 6px;
  margin-left: -8px;
  margin-bottom: 16px;
  margin-top: -8px;
  border-radius: 50px;
  transition: 0.1s background-color;
  cursor: pointer;

  &:hover {
    background-color: rgba(0, 0, 0, 0.08);
  }
`;

export const HeaderArrow = styled.div`
  ${centerImage('18px', '18px')};
  margin-left: 8px;
  height: 16px;
  width: 16px;
  background-image: url(${icons.forward});
  display: inline-block;
  position: absolute;
  filter: invert(100%);
  top: 50%;
  transform: translateY(-50%);
  right: 4px;
`;

export const Separator = styled.div`
  background-color: rgba(0, 0, 0, 0.12);
  height: 1px;
  width: 100%;
`;

export const Section = styled.div`
  padding: 24px;
  background-color: rgba(255, 255, 255, 0.15);
  margin-bottom: 24px;
  border-radius: 30px;
  color: white;
`;

export const Menu = styled.div`
  display: flex;
  margin-left: -16px;
  margin-top: -16px;
  flex-wrap: wrap;
  justify-content: center;
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

export const Title = styled.div`
  font-size: 24px;
  margin-left: 24px;
  font-weight: 300;
  margin-bottom: 16px;
  margin-top: 24px;
  color: white;
`;

export const Content = styled.div`
  width: calc(100% - 64px);
  max-width: 800px;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;
