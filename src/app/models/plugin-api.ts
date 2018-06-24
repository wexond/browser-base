import React from 'react';
import { TabProps } from '../components/Tab';

export default interface PluginAPI {
  decorateTab?: (tabClass: React.ComponentClass) => React.ComponentClass<TabProps>;
} // eslint-disable-line
