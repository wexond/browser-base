import { observer } from 'mobx-react';
import * as React from 'react';
import store from '../../store';
import {
  StyledOverlay,
  HeaderText,
  StyledTabGroup,
  StyledTabGroups,
  AddTabGroup,
  HeaderArrow,
  SelectedIndicator,
  Separator,
  Section,
} from './style';
import { ipcRenderer } from 'electron';
import { BottomSheet } from '../BottomSheet';
import { colors } from '~/renderer/constants';

const onClick = () => {
  store.overlayVisible = false;
  setTimeout(() => {
    ipcRenderer.send('browserview-show');
  }, 200);
};

const onBsClick = (e: React.MouseEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

const Header = ({ children }: any) => {
  return (
    <HeaderText>
      <div style={{ display: 'inline-block' }}>{children}</div>
      <HeaderArrow />
    </HeaderText>
  );
};

const TabGroups = observer(() => {
  return (
    <StyledTabGroups>
      <TabGroup selected={true} color={colors.lightBlue['500']} />
      <TabGroup selected={false} color={colors.orange['500']} />
      <AddTabGroup />
    </StyledTabGroups>
  );
});

const TabGroup = observer(({ selected, color }: any) => {
  return (
    <StyledTabGroup
      style={{
        backgroundColor: color,
      }}
    >
      Tab group
      <SelectedIndicator visible={selected} />
    </StyledTabGroup>
  );
});

export const Overlay = observer(() => {
  return (
    <StyledOverlay visible={store.overlayVisible} onClick={onClick}>
      <BottomSheet visible={store.overlayVisible} onClick={onBsClick}>
        <Section>
          <Header>Tab groups</Header>
          <TabGroups />
        </Section>
        <Separator />
        <Section>
          <Header>Downloads</Header>
        </Section>
      </BottomSheet>
    </StyledOverlay>
  );
});
