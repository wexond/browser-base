import styled from 'styled-components';
import opacity from '../../../../../shared/defaults/opacity';
import typography from '../../../../../shared/mixins/typography';
import images from '../../../../../shared/mixins/images';

const homeIcon = require('../../../../../shared/icons/home.svg');

export const Root = styled.div`
  margin-left: 4px;
  padding: 4px;
  display: flex;
  align-items: center;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.2s background-color;

  &:first-child {
    margin-left: 0px;
  }

  &:hover {
    background-color: rgba(0, 0, 0, 0.06);
  }
`;

export const Title = styled.div`
  padding-left: 2px;
  padding-right: 2px;
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});

  ${typography.subtitle2()};
`;

export const HomeIcon = styled.div`
  width: 20px;
  height: 20px;
  transition: 0.2s opacity;
  background-image: url(${homeIcon});
  opacity: ${opacity.light.inactiveIcon};

  ${images.center('100%', 'auto')};
`;
