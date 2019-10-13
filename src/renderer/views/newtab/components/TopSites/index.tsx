import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { StyledTopSites, Placeholder } from './style';
import store from '../../store';
import { TopSite } from '../TopSite';

export const TopSites = observer(() => {
  return (
    <StyledTopSites>
      {store.topSites.map(item => (
        <TopSite key={item._id} item={item} />
      ))}
      {store.topSites.length < 8 && <TopSite />}
      {Array(8 - (store.topSites.length + 1))
        .fill(1)
        .map((v, i) => (
          <Placeholder key={i} />
        ))}
    </StyledTopSites>
  );
});
