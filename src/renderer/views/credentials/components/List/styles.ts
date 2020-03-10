import styled from 'styled-components';

import { robotoRegular, centerIcon } from '~/renderer/mixins';
import { transparency, ICON_CLOSE } from '~/renderer/constants';

export const StyledItem = styled.div`
  display: flex;
  height: 32px;
  align-items: center;
`;

export const Username = styled.div`
  font-size: 13px;
  color: rgba(0, 0, 0, ${transparency.text.medium});
  flex: 2;
  ${robotoRegular()};
`;

export const Password = styled(Username)`
  flex: 1;
`;

export const DeleteIcon = styled.div`
  width: 16px;
  height: 16px;
  background-image: url(${ICON_CLOSE});
  opacity: ${transparency.icons.inactive};
  cursor: pointer;
  ${centerIcon('contain')};

  &:hover {
    opacity: 1;
  }
`;
