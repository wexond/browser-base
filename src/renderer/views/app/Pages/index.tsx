import { observer } from 'mobx-react';
import React from 'react';
import store from '../../../store';
import Page from '../Page';
import StyledPages from './styles';

@observer
export default class Pages extends React.Component {
  public render() {
    return (
      <StyledPages>
        {store.pages.map(page => (
          <Page key={page.id} page={page} />
        ))}
      </StyledPages>
    );
  }
}
