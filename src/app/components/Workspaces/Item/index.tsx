import React from 'react';

import {
  Root, IconsContainer, Icon, Label,
} from './styles';

export interface Props {
  label: string;
  icons: any;
  selected?: boolean;
}

export default class extends React.Component<Props, {}> {
  public static defaultProps = {
    selected: false,
  };

  public render() {
    const { label, icons, selected } = this.props;

    return (
      <Root>
        <IconsContainer selected={selected}>
          {icons != null && icons.map((data: any, key: any) => <Icon src={data} />)}
        </IconsContainer>
        <Label>{label}</Label>
      </Root>
    );
  }
}
