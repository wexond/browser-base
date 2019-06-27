import * as React from 'react';

import HistoryItem from '../HistoryItem';
import { HistorySection } from '../../models';

import { EmptySection, SectionTitle } from '../Overlay/style';

export default ({ data }: { data: HistorySection }) => {
  return (
    <EmptySection>
      <SectionTitle>{data.label}</SectionTitle>
      {data.items.map(item => (
        <HistoryItem key={item._id} data={item} />
      ))}
    </EmptySection>
  );
};
