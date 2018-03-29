import { observer } from 'mobx-react'; // eslint-disable-line no-unused-vars
import React from 'react';

// Styles
import StyledPage from './styles';

// Models
import Page from '../../models/page';

import Store from '../../store';

interface Props {
  page: Page;
  selected: boolean;
}

@observer
export default class extends React.Component<Props, {}> {
  public componentDidMount() {
    const { webview, id } = this.props.page;
    const tab = Store.getTabById(id);

    webview.addEventListener(
      'page-title-updated',
      ({ title }: { title: string; explicitSet: string }) => {
        tab.title = title;
      },
    );
  }

  public render() {
    const { page, selected } = this.props;
    const { url } = page;

    return (
      <StyledPage selected={selected}>
        <webview src={url} style={{ height: '100%' }} ref={r => (page.webview = r)} />
      </StyledPage>
    );
  }
}
