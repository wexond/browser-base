import * as React from 'react';

import colors from '../../defaults/colors';
import { UITheme, ButtonType } from '../../enums';

import {
  StyledButton, Icon, Text, OverShade,
} from './styles';

export type ButtonEvent = (e?: React.SyntheticEvent<HTMLDivElement>) => void;

export interface IProps {
  background?: string;
  foreground?: string;
  whiteIcon?: boolean;
  icon?: string;
  type?: ButtonType;
  inline?: boolean;
  style?: any;
}

export default class Button extends React.Component<IProps, {}> {
  public static defaultProps = {
    background: colors.deepPurple['500'],
    foreground: '#fff',
    whiteIcon: true,
    type: ButtonType.Contained,
    inline: false,
  };

  public render() {
    const {
      background, foreground, whiteIcon, icon, children, style, inline, type,
    } = this.props;

    return (
      <React.Fragment>
        <StyledButton color={background} icon={icon != null} style={style} type={type}>
          {icon != null && <Icon src={icon} white={whiteIcon} />}
          <Text color={foreground}>{children}</Text>
          <OverShade className="over-shade" color={foreground} />
        </StyledButton>
        {!inline && <div style={{ clear: 'both' }} />}
      </React.Fragment>
    );
  }
}
