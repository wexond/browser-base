import { observer } from 'mobx-react';
import * as React from 'react';

import Pages from '../Pages';
import Toolbar from '../Toolbar';
import { StyledApp, Line } from './styles';
import store from '../../store';
import TabGroupsMenu from '../TabGroupsMenu';
import PageMenu from '@app/components/PageMenu';
import UpdateSnackbar from '@app/components/UpdateSnackbar';
import AddressBar from '@app/components/AddressBar';

@observer
class App extends React.Component {
  public async componentDidMount() {
    window.addEventListener('mousemove', this.onWindowMouseMove);
    window.addEventListener('mousedown', this.onWindowMouseDown);
    window.addEventListener('mouseup', this.onWindowMouseUp);

    await store.historyStore.load();
    await store.faviconsStore.load();
    await store.bookmarksStore.load();

    store.keyBindings.load();
  }

  public componentWillUnmount() {
    window.removeEventListener('mousemove', this.onWindowMouseMove);
    window.removeEventListener('mousedown', this.onWindowMouseDown);
    window.removeEventListener('mouseup', this.onWindowMouseUp);
  }

  public onWindowMouseMove = (e: MouseEvent) => {
    store.mouse.x = e.pageX;
    store.mouse.y = e.pageY;
  };

  public onWindowMouseDown = (e: MouseEvent) => {
    store.pageMenuStore.visible = false;
    store.menuStore.visible = false;
  };

  public onWindowMouseUp = (e: MouseEvent) => {
    store.bookmarksStore.dialogVisible = false;
  };

  public render() {
    return (
      <StyledApp>
        <Toolbar />
        <AddressBar />
        <Line />
        <Pages />
        <PageMenu />
        <TabGroupsMenu />
        <UpdateSnackbar />
      </StyledApp>
    );
  }
}

export default App;
