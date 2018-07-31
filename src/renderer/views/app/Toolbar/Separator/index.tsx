import styled from 'styled-components';
import opacity from '../../../../shared/defaults/opacity';

export default styled.div`
  height: calc(100% - 24px);
  min-width: 1px;
  top: 50%;
  position: relative;
  transform: translateY(-50%);
  margin-left: 8px;
  margin-right: 8px;

  background-color: rgba(0, 0, 0, ${opacity.light.dividers});
`;
