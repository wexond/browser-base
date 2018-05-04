import React from 'react';
import { Checkbox } from 'nersent-ui';
import { observer } from 'mobx-react';

import PageLayout from '../../../shared/components/PageLayout';

import {
  Card,
  Content,
  Title,
  Item,
  ItemPrimaryText,
  ItemSecondaryText,
  CardHeader,
  ItemIcon,
} from './styles';

@observer
export default class App extends React.Component {
  public render() {
    const checkboxStyle = {
      marginLeft: 16,
    };

    const timeStyle = {
      marginLeft: 16,
    };

    const primaryStyle = {
      marginLeft: 16,
    };

    return (
      <PageLayout title="History">
        <Content>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(() => (
            <Card>
              <CardHeader>
                <Checkbox style={checkboxStyle} />
                <Title>Today - 4th of May</Title>
              </CardHeader>
              {[1, 2, 3, 4].map(() => (
                <Item>
                  <Checkbox style={checkboxStyle} />
                  <ItemSecondaryText style={timeStyle}>12:51</ItemSecondaryText>
                  <ItemIcon />
                  <ItemPrimaryText style={primaryStyle}>Google</ItemPrimaryText>
                </Item>
              ))}
            </Card>
          ))}
        </Content>
      </PageLayout>
    );
  }
}
