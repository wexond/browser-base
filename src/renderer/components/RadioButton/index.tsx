import * as React from 'react';

import { Container, Radio, Label, Root, Circle } from './styles';
import { any, string } from 'prop-types';
import { colors } from '~/renderer/constants';

interface Props {
  color?: string;
  selected: boolean;
  onSelect?: (value: string) => void;
  labelText?: string;
  name?: string;
  value: string;
}

interface State {
  checked: boolean;
}

export class RadioButton extends React.PureComponent<Props, State> {

  public state: State = {
    checked: this.props.selected,
  };

  public get isChecked() {
    const { checked } = this.state;
    return checked == null ? this.props.selected : checked;
  }

  public set isChecked(val: boolean) {
    const { onSelect } = this.props;

    this.setState({ checked: val });
    if (onSelect) onSelect(this.props.value);
  }

  private onClick = () => {
    this.isChecked = true;
  };


  public render() {
    return (
      <Container>
        <Root>
          <Radio 
            onClick={this.onClick}
            name={this.props.name} 
            type='radio' 
            className="radio-button" 
            defaultChecked={this.isChecked} 
            value={this.props.value} />
          <Circle/>
        </Root>
        {this.props.labelText && <Label>{this.props.labelText}</Label>}
      </Container>
    );
  }
}
