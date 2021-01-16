import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { injectFonts } from '~/renderer/mixins';
import { configureUI } from '~/common/renderer-config';

export const renderWebUI = (Component: any) => {
  injectFonts();
  configureUI();

  ReactDOM.render(
    React.createElement(Component),
    document.getElementById('app'),
  );
};
