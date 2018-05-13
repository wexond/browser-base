import styled from 'styled-components';
import { typography } from 'nersent-ui';
import images from '../../../shared/mixins/images';

export const StyledItem = styled.div`
  height: 56px;
  width: 100%;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }

  &:last-child {
    border-bottom: none;
  }
`;

export const Icon = styled.div`
  height: 16px;
  min-width: 16px;
  margin-left: 24px;
  ${images.center('16px', 'auto')};
`;

export const PrimaryText = styled.div`
  ${typography.robotoRegular()};
  font-size: 14px;
  opacity: 0.87;
`;

export const SecondaryText = styled.div`
  ${typography.robotoRegular()};
  font-size: 14px;
  opacity: 0.54;
`;

export const Title = styled(PrimaryText)`
  margin-left: 48px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-right: 24px;
`;

export const Time = styled(SecondaryText)`
  margin-left: 24px;
`;
