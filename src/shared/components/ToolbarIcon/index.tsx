import React from 'react';
import { observer } from 'mobx-react';
import { StyledContainer, StyledIcon } from './styles';

export interface IProps {
  image?: string;
}

@observer
export default class ToolbarIcon extends React.Component<IProps, {}> {
  public render() {
    const { image } = this.props;

    return (
      <StyledContainer>
        <StyledIcon image={image} />
      </StyledContainer>
    );
  }
}
