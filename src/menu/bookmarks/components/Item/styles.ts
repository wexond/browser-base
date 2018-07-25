import styled, { css } from 'styled-components';
import * as PageItem from '../../../../shared/components/PageItem';

export const Title = styled(PageItem.Title)`
  margin-left: 12px;
  margin-right: 12px;
  padding: 8px;
  border-radius: 4px;
  will-change: background-color;
  transition: 0.2s background-color;

  ${({ isFolder }: { isFolder: boolean }) => css`
    ${isFolder
      && `
      cursor: text;

      &:hover {
        background-color: rgba(0, 0, 0, 0.06);
      }
    `};
  `};
`;
