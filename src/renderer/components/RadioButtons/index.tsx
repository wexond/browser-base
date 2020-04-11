import * as React from 'react';

interface Props {
  defaultValue?: any;
  children?: any;
}

interface State {
  selectedItem: any;
}

export default class RadioButtons extends React.PureComponent<Props, State> {
  public state: State = {
    selectedItem: null,
  };

  public onSelect = (value: any) => {
    this.value = value;
  };

  public get value() {
    const { defaultValue } = this.props;
    const { selectedItem } = this.state;
    return selectedItem || defaultValue;
  }

  public set value(val: any) {
    this.setState({ selectedItem: val });
  }

  render() {
    const { children } = this.props;

    return (
      <>
        {React.Children.map(children, (child) => {
          return React.cloneElement(child, {
            selected: this.value === child.props.value,
            onSelect: this.onSelect,
          });
        })}
      </>
    );
  }
}
