import styled from 'styled-components';
import { centerImage } from '@/mixins';

export const StyledBookmarkItem = styled.div`
  padding: 6px 8px;
  font-size: 13px;
  border-radius: 30px;
  overflow: hidden;
  display: flex;
  align-items: center;
  transition: 0.2s background-color;

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }

  &:first-child {
    margin-left: 8px;
  }
`;

export const Icon = styled.div`
  ${centerImage('16px', '16px')};
  height: 16px;
  min-width: 16px;
  margin-right: 8px;
`;

export const Title = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  max-width: 96px;
`;
