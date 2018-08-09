import { observer } from 'mobx-react';
import React from 'react';

import { PageContent } from '../../app/Menu/styles';
import {
  Table,
  HeadRow,
  HeadItem,
  BodyRow,
  BodyItem,
} from '../../../components/Table';
import { Container } from './styles';

@observer
export default class KeysManager extends React.Component {
  public render() {
    return (
      <PageContent>
        <Container>
          <Table>
            <thead>
              <HeadRow style={{ height: 55 }}>
                <HeadItem>Command</HeadItem>
                <HeadItem>Keybinding</HeadItem>
                <HeadItem>Source</HeadItem>
              </HeadRow>
            </thead>
            <tbody>
              <BodyRow>
                <BodyItem>New tab</BodyItem>
                <BodyItem>ctrl + n</BodyItem>
                <BodyItem>Default</BodyItem>
              </BodyRow>
            </tbody>
          </Table>
        </Container>
      </PageContent>
    );
  }
}
