import * as React from 'react';
import { Button } from '~/renderer/components/Button';
import { StyledSmallDialog, Title } from './style';

type ClickEvent = (e: React.MouseEvent<HTMLDivElement>) => void;

export const SelectionDialog = ({
  amount,
  visible,
  onDeleteClick,
  onCancelClick,
}: {
  amount: number;
  visible: boolean;
  onDeleteClick: ClickEvent;
  onCancelClick: ClickEvent;
}) => {
  return (
    <StyledSmallDialog visible={visible}>
      <Title>{amount} selected</Title>
      <Button style={{ marginLeft: 16 }} onClick={onDeleteClick}>
        Delete
      </Button>
      <Button
        background="#757575"
        style={{ marginLeft: 8 }}
        onClick={onCancelClick}
      >
        Cancel
      </Button>
    </StyledSmallDialog>
  );
};
