import { transparency, colors } from 'nersent-ui';
import styled from 'styled-components';
import images from '../../../shared/mixins/images';

interface SuggestionProps {
  selected: boolean;
}

export const StyledSuggestion = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  transition: 0.1s background-color;

  &:hover {
    background-color: #eee;
  }

  background-color: ${(props: SuggestionProps) =>
    (props.selected ? `${colors.grey['300']} !important` : '')};
`;

export const PrimaryText = styled.div`
  margin-left: 64px;
  opacity: ${transparency.light.text.primary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SecondaryText = styled.div`
  opacity: ${transparency.light.text.secondary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 16px;
`;

export const Icon = styled.div`
  position: absolute;
  left: 16px;
  width: 16px;
  height: 16px;

  ${images.center('16px', '16px')};
`;

export const Dash = styled.div`
  margin-left: 4px;
  margin-right: 4px;
  opacity: ${transparency.light.text.secondary};
`;
