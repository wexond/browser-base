import { observer } from 'mobx-react';
import React from 'react';
import { getSelectedTab, getCurrentWorkspace } from '../../../../utils';
import store from '../../../store';
import Newtab from '../../newtab/Newtab';
import Page from '../Page';
import StyledPages from './styles';

@observer
export default class Pages extends React.Component {
  public render() {
    // const tab = getSelectedTab();

    return (
      <StyledPages>
        {store.pages.map(page => (
          <Page key={page.id} page={page} />
        ))}
        {/* <Newtab visible={tab && tab.isNew} /> */}
      </StyledPages>
    );
  }
}
