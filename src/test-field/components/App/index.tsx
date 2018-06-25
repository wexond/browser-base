import React from 'react';

import colors from '../../../shared/defaults/colors';

import Button from '../../../shared/components/Button';
import { ButtonType, UITheme } from '../../../shared/enums';

import { StyledApp } from './styles';

const addIcon = require('../../../shared/icons/add.svg');

export interface IState {
  darkTheme: boolean;
}

export default class App extends React.Component<{}, IState> {
  public state: IState = {
    darkTheme: false,
  };

  onChange = (e: any) => {
    const { darkTheme } = this.state;

    this.setState({
      darkTheme: !darkTheme,
    });
  };

  public render() {
    const { darkTheme } = this.state;
    const theme: UITheme = darkTheme ? UITheme.Dark : UITheme.Light;

    const background = colors.deepPurple['500'];
    const foreground = '#fff';
    const inlineButtonStyle = { marginLeft: '24px' };
    const buttonStyle = { marginTop: '24px' };
    const clear = <div style={{ clear: 'both' }} />;

    return (
      <StyledApp theme={theme}>
        <input type="checkbox" onChange={this.onChange} />
        <br />
        <br />
        <Button theme={theme} background={background} foreground={foreground} inline>
          BUTTON
        </Button>
        <Button
          theme={theme}
          background={background}
          foreground={foreground}
          style={inlineButtonStyle}
          inline
          disabled
        >
          BUTTON
        </Button>
        {clear}
        <Button
          theme={theme}
          background={background}
          foreground={foreground}
          icon={addIcon}
          style={buttonStyle}
          inline
        >
          BUTTON
        </Button>
        <Button
          theme={theme}
          background={background}
          foreground={foreground}
          icon={addIcon}
          style={inlineButtonStyle}
          inline
          disabled
        >
          BUTTON
        </Button>
        {clear}
        <Button
          theme={theme}
          foreground={background}
          style={buttonStyle}
          type={ButtonType.Text}
          inline
        >
          BUTTON
        </Button>
        <Button
          theme={theme}
          foreground={background}
          style={inlineButtonStyle}
          type={ButtonType.Text}
          inline
          disabled
        >
          BUTTON
        </Button>
        {clear}
        <Button
          theme={theme}
          foreground={background}
          style={buttonStyle}
          type={ButtonType.Outlined}
          inline
        >
          BUTTON
        </Button>
        <Button
          theme={theme}
          foreground={background}
          style={inlineButtonStyle}
          type={ButtonType.Outlined}
          inline
          disabled
        >
          BUTTON
        </Button>
        {clear}
      </StyledApp>
    );
  }
}
