import styled from 'styled-components';

import opacity from '../../../../shared/defaults/opacity';

export const Root = styled.div`
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  padding-left: 32px;
  border-bottom: 1px solid rgba(0, 0, 0, ${opacity.light.dividers});
  overflow: hidden;
  background-color: white;
`;
