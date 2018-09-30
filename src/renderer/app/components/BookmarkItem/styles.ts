import styled, { css } from 'styled-components';
import { centerImage } from '@/mixins';

export const StyledBookmarkItem = styled.div`
  padding: 7px 8px;
  font-size: 13px;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  align-items: center;
  transition: 0.2s background-color;
  margin-left: 4px;
  margin-bottom: 3px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  &:first-child {
    margin-left: 8px;
  }
`;

export const Icon = styled.div`
  height: 16px;
  min-width: 16px;
  margin-right: 8px;

  ${centerImage('16px', '16px')};
`;

export const Title = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 128px;
`;
