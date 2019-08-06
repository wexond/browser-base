import styled from 'styled-components';
import { colors } from '~/renderer/constants';
import { body2 } from '~/renderer/mixins';

export const Center = styled.div`
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 72px;
  margin-right: 72px;
`;

export const StyledAddressBar = styled.input`
  background-color: rgba(0, 0, 0, 0.03);
  border: none;
  width: 100%;
  height: 28px;
  max-width: 1200px;
  border-radius: 4px;
  overflow: hidden;
  outline: none;
  padding-left: 8px;
  transition: 0.2s background-color;
  ${body2()};
  font-size: 13px;

  &:focus {
    border: 2px solid ${colors.blue['100']};
    background-color: white;
    transition: none;

    &:hover {
      background-color: white;
    }
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;
