import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { injectFonts } from '~/renderer/mixins';

export const renderWebUI = (Component: any) => {
  injectFonts();

  ReactDOM.render(
    React.createElement(Component),
    document.getElementById('app'),
  );
};
