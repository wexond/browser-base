import { observer } from 'mobx-react';
import React from 'react';
import StyledPages from './styles';
import Page from '../Page';
import store from '../../../store';
import Newtab from '../../newtab/Newtab';

@observer
export default class Pages extends React.Component {
  public render() {
    const tab = store.getSelectedTab();

    return (
      <StyledPages>
        {store.pages.map(page => (
          <Page key={page.id} page={page} />
        ))}
        <Newtab visible={tab && tab.isNew} />
      </StyledPages>
    );
  }
}
