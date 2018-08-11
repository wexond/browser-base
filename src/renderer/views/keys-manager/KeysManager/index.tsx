import { observer } from 'mobx-react';
import React from 'react';

import store from '../../../store';
import { PageContent } from '../../app/Menu/styles';
import Chip from '../Chip';
import {
  Container, Table, HeadRow, HeadItem, BodyRow, BodyItem,
} from './styles';
import { KeyBinding } from '../../../../interfaces';

@observer
export default class KeysManager extends React.Component {
  public onChipClick = (keyBinding: KeyBinding) => {};

  public render() {
    return (
      <PageContent>
        <Container>
          <Table>
            <thead>
              <HeadRow>
                <HeadItem>Command</HeadItem>
                <HeadItem>Keybinding</HeadItem>
                <HeadItem>Source</HeadItem>
              </HeadRow>
            </thead>
            <tbody>
              {store.keyBindings.map((data, key) => (
                <BodyRow key={key}>
                  <BodyItem>{data.command}</BodyItem>
                  <BodyItem>
                    {typeof data.key === 'string' && (
                      <Chip keyBinding={data} onClick={this.onChipClick} />
                    )}
                  </BodyItem>
                  <BodyItem>{data.isChanged ? 'User' : 'Default'}</BodyItem>
                </BodyRow>
              ))}
            </tbody>
          </Table>
        </Container>
      </PageContent>
    );
  }
}
