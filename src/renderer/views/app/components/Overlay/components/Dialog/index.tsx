import * as React from 'react';
import styled, { css } from 'styled-components';

import { EASING_FUNCTION } from '~/renderer/constants';
import { robotoRegular, robotoMedium } from '~/renderer/mixins';
import { Button } from '~/renderer/components/Button';
import store from '~/renderer/views/app/store';

const onHideClick = () => {
  store.overlay.dialogContent = null;
};

export const CloseButton = () => {
  return (
    <Button background="transparent" foreground="#3F51B5" onClick={onHideClick}>
      CLOSE
    </Button>
  );
};

export const Dialog = styled.div`
  width: 100%;
  max-width: 512px;
  height: fit-content;
  position: fixed;
  background-color: #fff;
  border-radius: 8px;
  padding-bottom: 8px;
  transition: 0.15s transform ${EASING_FUNCTION};
  ${robotoRegular()};

  ${({ visible }: { visible: boolean }) => css`
    pointer-events: ${visible ? 'auto' : 'none'};
    opacity: ${visible ? 1 : 0};
    transform: ${visible ? 'translateY(0)' : 'translateY(-24px)'};
  `}
`;

export const Title = styled.div`
  padding: 16px 16px 8px 16px;
  font-size: 16px;
  ${robotoMedium()};
`;

export const Content = styled.div`
  padding: 8px 16px 0px 16px;
`;

export const Buttons = styled.div`
  width: 100%;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 12px;
  padding-right: 8px;

  & > * {
    margin-right: 4px;
  }
`;

export const Bold = styled.span`
  font-size: 14px;
  ${robotoMedium()};
`;
