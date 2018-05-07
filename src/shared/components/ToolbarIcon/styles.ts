import styled from 'styled-components';
import { center } from '../../mixins/images';

export const StyledContainer = styled.div`
  width: 24px;
  height: 24px;
  margin-left: 64px;
  cursor: pointer;
`;

export interface IStyledIcon {
  image: string;
}

export const StyledIcon = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(${(props: IStyledIcon) => props.image});
  ${center('24px', 'auto')};
  opacity: 0.87;
`;
