import styled, { css } from 'styled-components';
import { centerImage } from '~/shared/mixins';
import { icons } from '../../constants';
import { colors } from '~/renderer/constants';

export const StyledItem = styled.div`
  height: 50px;
  width: 200px;
  margin-right: 16px;
  background-color: rgba(255, 255, 255, 0.12);
  border-radius: 30px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  transition: 0.2s background-color;

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

export const Progress = styled.div`
  background-color: ${colors.blue['500']};
  height: 100%;
  border-radius: 30px;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0.2;
`;

export const Icon = styled.div`
  height: 20px;
  width: 20px;
  ${centerImage('100%', '100%')};
  margin-left: 16px;
  margin-right: 16px;
  background-image: url(${icons.page});
  filter: invert(100%);
`;

export const Name = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
`;

export const Info = styled.div`
  margin-right: 16px;
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-flow: column;
`;

export const Details = styled.div`
  display: flex;
  justify-content: space-between;
  opacity: 0.54;
  font-size: 12px;

  ${({ visible }: { visible: boolean }) => css`
    display: ${visible ? 'block' : 'none'};
  `}
`;
