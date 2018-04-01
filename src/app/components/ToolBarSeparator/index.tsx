import styled from 'styled-components';
import Theme from '../../models/theme';
import { getForegroundColor } from '../../utils/colors';

interface Props {
  theme?: Theme;
}

export default styled.div`
  height: calc(100% - 24px);
  min-width: 1px;
  top: 50%;
  position: relative;
  transform: translateY(-50%);
  margin-left: 8px;
  margin-right: 8px;

  background-color: ${(props: Props) => getForegroundColor('dividers', props.theme.toolbar)};
  display: ${(props: Props) => (props.theme.toolbar.separatorsVisible ? 'block' : 'none')};
`;
