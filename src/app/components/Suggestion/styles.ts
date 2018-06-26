import styled, { css } from 'styled-components';
import images from '../../../shared/mixins/images';
import opacity from '../../../shared/defaults/opacity';

export const StyledSuggestion = styled.div`
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;

  ${({ selected, hovered }: { selected: boolean; hovered: boolean }) => {
    let backgroundColor = 'transparent';

    if (selected) backgroundColor = 'rgba(0, 0, 0, 0.08)';
    else if (hovered) backgroundColor = 'rgba(0, 0, 0, 0.04)';

    return css`
      background-color: ${backgroundColor};
    `;
  }};
`;

export const PrimaryText = styled.div`
  margin-left: 64px;
  opacity: ${opacity.light.primaryText};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const SecondaryText = styled.div`
  opacity: ${opacity.light.secondaryText};
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
  opacity: ${opacity.light.secondaryText};
`;
