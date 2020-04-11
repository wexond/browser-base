import styled, { css } from 'styled-components';
import { ICON_MORE } from '~/renderer/constants';
import { IconButton } from '../App/style';
import { centerIcon } from '~/renderer/mixins';

export const EnginesTable = styled.div`
  display: flex;
  flex-flow: column;
`;

export const TableRow = styled.div`
  margin-right: 0;
  display: grid;
  grid-template-columns: 4fr 3fr 3fr 38px;
  line-height: 20px;
  height: 36px;
  align-items: center;

  ${({ bold }: { bold?: boolean }) => css`
    font-weight: ${bold ? 500 : 300};
  `};
`;

export const TableCell = styled.div`
  display: flex;
  align-items: center;
  line-height: 26px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  padding: 0 12px;

  &:nth-child(1) {
    grid-column: 1 / auto;
  }

  &:nth-child(2) {
    grid-column: 2 / auto;
  }

  &:nth-child(3) {
    grid-column: 3 / auto;
  }

  * {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

export const TableHeader = styled(TableCell)`
  opacity: 0.54;
  margin-top: 8px;
`;

export const MoreButton = styled(IconButton)`
  height: 32px;
  width: 32px;
  background-image: url(${ICON_MORE});
  grid-column: 4 / auto;
  ${centerIcon(18)}
`;
