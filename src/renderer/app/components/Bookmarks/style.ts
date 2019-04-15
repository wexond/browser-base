import styled, { css } from 'styled-components';

import { centerImage, shadows } from '~/shared/mixins';
import { icons } from '../../constants';
import { Button } from '~/renderer/components/Button';
import { platform } from 'os';
import { Section } from '../Overlay/style';

export const BookmarkSection = styled(Section)`
  padding: 8px 0px;
  margin-top: 48px;
`;

export const Sections = styled.div`
  margin-left: 300px;
  width: calc(100% - 300px);
  display: flex;
  flex-flow: column;
  align-items: center;
`;

export const Input = styled.input`
  border: none;
  outline: none;
  color: white;
  width: 100%;
  padding-left: 42px;
  background-color: transparent;
  height: 100%;
  font-size: 14px;

  &::placeholder {
    color: rgba(255, 255, 255, 0.54);
  }
`;

export const Search = styled.div`
  margin-left: 32px;
  margin-right: 32px;
  margin-top: 24px;
  height: 42px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 0.12);

  position: relative;

  &:after {
    content: '';
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    ${centerImage('16px', '16px')};
    background-image: url(${icons.search});
    filter: invert(100%);
  }
`;

export const DeletionDialog = styled.div`
  width: fit-content;
  height: 68px;
  background-color: #303030;
  position: absolute;
  top: 48px;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 8px;
  overflow: hidden;
  display: flex;
  align-items: center;
  padding: 0px 16px;
  transform: translateX(150px);
  box-shadow: ${shadows(8)};
  will-change: opacity;
  transition: 0.15s opacity;

  ${({ visible }: { visible: boolean }) => css`
    opacity: ${visible ? 1 : 0};
    pointer-events: ${visible ? 'auto' : 'none'};
  `};
`;

export const DeletionDialogLabel = styled.div`
  font-size: 14px;
`;
