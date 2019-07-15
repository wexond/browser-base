import * as React from 'react';

import { Label } from '../RadioButton/styles';
import { Container, StyledCheckbox, Icon } from './styles';

interface Props {
  children?: any;
}

interface State {
  toggled: boolean;
}

export default class Checkbox extends React.PureComponent<Props, State> {
  public state: State = {
    toggled: false,
  };

  private onClick = () => {
    this.value = !this.value;
  };

  public get value() {
    const { toggled } = this.state;
    return toggled;
  }

  public set value(toggled: boolean) {
    this.setState({ toggled });
  }

  render() {
    const { children } = this.props;
    const { toggled } = this.state;
    return (
      <Container>
        <StyledCheckbox
          className="checkbox"
          toggled={toggled}
          onClick={this.onClick}
        >
          <Icon toggled={toggled} />
        </StyledCheckbox>
        {children && <Label>{children}</Label>}
      </Container>
    );
  }
}
