import React from 'react';

import {
  Root, IconsContainer, Icon, Label,
} from './styles';

export interface Props {
  label: string;
  icons: any;
}

export default class extends React.Component<Props, {}> {
  public render() {
    const { label, icons } = this.props;

    return (
      <Root>
        <IconsContainer>
          {icons != null && icons.map((data: any, key: any) => <Icon src={data} />)}
        </IconsContainer>
        <Label>{label}</Label>
      </Root>
    );
  }
}
