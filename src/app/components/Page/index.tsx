import { observer } from 'mobx-react';
import React from 'react';

// Styles
import StyledPage from './styles';

// Models
import Page from '../../models/page';

interface IProps {
  page: Page;
  selected: boolean;
}

export default observer(({ page, selected }: IProps) => {
  const { url } = page;

  return (
    <StyledPage selected={selected}>
      <webview src={url} style={{ height: '100%' }} />
    </StyledPage>
  );
});
