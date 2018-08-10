import styled from 'styled-components';

import { PageContainer } from '../../app/Menu/styles';
import { robotoMedium, robotoRegular } from '../../../mixins';
import { opacity } from '../../../../defaults';

export const Container = styled(PageContainer)`
  width: 100%;
`;

export const Table = styled.table`
  width: 100%;
  margin: 0px auto;
  border-collapse: collapse;
  position: relative;
  background-color: #fff;
  word-break: break-all;
`;

export const HeadRow = styled.tr`
  height: 55px;
  text-align: left;
  border-bottom: 1px solid rgba(0, 0, 0, ${opacity.light.dividers});
`;

export const HeadItem = styled.th`
  font-size: 13px;
  padding-left: 24px;
  opacity: ${opacity.light.secondaryText};

  ${robotoMedium()};
`;

export const BodyRow = styled.tr`
  height: 48px;
  border-top: 1px solid rgba(0, 0, 0, ${opacity.light.dividers});
  will-change: background-color;
  transition: 0.2s background-color;

  &:first-child {
    border-top: unset;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;

export const BodyItem = styled.td`
  font-size: 14px;
  padding-left: 24px;
  opacity: ${opacity.light.primaryText};

  ${robotoRegular()};
`;

export const Key = styled.div`
  height: 30px;
  display: inline-flex;
  padding-left: 12px;
  padding-right: 12px;
  border-radius: 16px;
  align-items: center;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.12);
`;
