import styled from 'styled-components';
import opacity from '../../../shared/defaults/opacity';
import typography from '../../../shared/mixins/typography';

export const StyledApp = styled.div`
  width: 100%;
  height: 100vh;
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  flex-flow: row;
  position: relative;
  padding-top: 24px;
  background-color: #f5f5f5;
  flex-wrap: wrap;

  opacity: ${({ visible }: { visible: boolean }) => (visible ? 1 : 0)};
`;

export const Credits = styled.div`
  width: 100%;
  padding: 8px;
  color: rgba(0, 0, 0, ${opacity.light.secondaryText});
  background-color: #f5f5f5;
  ${typography.caption()};

  & a {
    transition: 0.2s color;
    text-decoration: underline;
  }

  & a:hover {
    color: rgba(0, 0, 0, ${opacity.light.primaryText});
  }
`;

export const Column = styled.div`
  display: flex;
  flex-flow: column;
  margin-left: 32px;
  align-items: flex-start;

  &:first-child {
    margin-left: 0px;
  }
`;
