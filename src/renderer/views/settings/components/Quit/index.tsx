import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Title, Row, Header } from '../App/style';
import { RadioButton } from '~/renderer/components/RadioButton';
import store from '../../store';

interface Props {
  initialValue: 'none' | 'multiple' | 'always';
}

interface State {
  value: 'none' | 'multiple' | 'always';
}

class QuitControl extends React.PureComponent<Props, State> {
  public state: State = {
    value: this.props.initialValue,
  };

  public get selectedItem() {
    return this.state.value || this.props.initialValue;
  }

  public set selectedItem(value: 'none' | 'multiple' | 'always') {
    store.settings.quitBehavior.type = value;
    store.save();

    this.setState({ value });
  }

  private select = (value: 'none' | 'multiple' | 'always') => () => {
    this.selectedItem = value;
  };

  public render() {
    const titleStyle = {
      marginLeft: 8,
    };

    const rowStyle = {
      cursor: 'pointer',
    };

    return (
      <>
        <Header>On Quit</Header>
        <Row style={rowStyle} onClick={this.select('none')}>
          <RadioButton selected={this.state.value === 'none'} />
          <Title style={titleStyle}>No warning message</Title>
        </Row>
        <Row style={rowStyle} onClick={this.select('multiple')}>
          <RadioButton selected={this.state.value === 'multiple'} />
          <Title style={titleStyle}>
            Only displaying a warning message when closing with multiple tabs
          </Title>
        </Row>
        <Row style={rowStyle} onClick={this.select('always')}>
          <RadioButton selected={this.state.value === 'always'} />
          <Title style={titleStyle}>
            Always displaying a warning message (even with one tab)
          </Title>
        </Row>
      </>
    );
  }
}

export const OnQuit = observer(() => {
  const { type } = store.settings.quitBehavior;
  return <QuitControl initialValue={type} />;
});
