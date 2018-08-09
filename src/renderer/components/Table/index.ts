import styled, { css } from 'styled-components';

import { opacity } from '../../../defaults';
import { robotoRegular, robotoMedium } from '../../mixins';

export const Table = styled.table`
  width: 100%;
  margin: 0px auto;
  border-collapse: collapse;
  position: relative;
  background-color: #fff;
`;

export const HeadRow = styled.tr`
  height: 48px;
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

  &:first-child {
    border-top: unset;
  }
`;

export const BodyItem = styled.td`
  font-size: 14px;
  padding-left: 24px;
  opacity: ${opacity.light.primaryText};

  ${robotoRegular()};
`;

/*
.posts-table {
  width: 100%;
  min-width: 1000px;
  margin: 0px auto;
  border-collapse: collapse;
  position: relative;
  background-color: #fff;
  display: none;

  & thead tr th {
    @include Roboto-Medium;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.54);
    text-align: left;
    padding: 22px;
    vertical-align: top;
    border-top: 0;
    vertical-align: bottom;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  }

  & tbody tr td {
    @include Roboto-Regular;
    @include text-selectable;
    text-align: left;
    padding: 24px;
    vertical-align: top;
    border-top: 0;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.87);
    position: relative;

    &:last-child {
      padding-left: 0px;
      padding-right: 0px;
      width: 40px;

      & .menu-icon {
        width: 40px;
        height: 64px;
        right: 22px;
        @include image-center(24px, auto);
        background-image: url(images/more.png);
        opacity: 0.54;
        position: absolute;
        @include center-vertical;
        cursor: pointer;
      }
    }
  }

  & tbody tr {
    transition: 0.3s background-color;
  }

  & tbody tr:hover {
    background-color: #eee;
    transition: 0.3s background-color;
  }

  & tbody .border td {
    border-top: 1px solid rgba(0, 0, 0, 0.12);
  }

  & .bold {
    @include Roboto-Medium;
  }

  & .check-box-header, & .check-box-cell, & .picture-header, & .picture-cell, & .id-header, & .id-cell {
    display: none;
  }

  & .picture-cell img {
    max-width: 196px;
  }

  &.pictures {
    & .picture-header, & .picture-cell {
      display: table-cell;
    }
  }

  &.check-boxes {
    & .check-box-header, & .check-box-cell {
      display: table-cell;
    }

    & .menu-icon-header, & .menu-icon-cell {
      display: none;
    }
  }

  & .not-editable .menu-icon {
    opacity: 0.26 !important;
    cursor: default !important;
  }
}
*/
