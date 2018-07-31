/* eslint-disable no-console */
import React from 'react';
import { StyledApp } from './styles';
import Dropdown from '../../../components/Dropdown';
import { UITheme } from '../../../enums';

export interface IState {
  darkTheme: boolean;
}

export default class App extends React.Component<{}, IState> {
  public state: IState = {
    darkTheme: false,
  };

  private onIconClick = () => {
    console.log('icon click');
  };

  public render() {
    const { darkTheme } = this.state;
    const theme: UITheme = darkTheme ? UITheme.Dark : UITheme.Light;

    return (
      <StyledApp theme={theme}>
        <Dropdown>
          <Dropdown.Item value="item-1">Item 1</Dropdown.Item>
          <Dropdown.Item value="item-2">Item 2</Dropdown.Item>
          <Dropdown.Item value="item-3">Item 3</Dropdown.Item>
          <Dropdown.Item value="item-4">Item 4</Dropdown.Item>
        </Dropdown>
      </StyledApp>
    );
  }
}
