import { observer } from 'mobx-react';
import { hot } from 'react-hot-loader';
import React from 'react';
import { Content } from './styles';

@observer
class About extends React.Component {
  public render() {
    return (
      <React.Fragment>
        <Content>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Provident vitae quo doloremque
          tempore? Dolores repudiandae eaque dicta eos nemo ipsum nihil iste, porro error voluptatem
          similique nisi nulla ipsa quia.
        </Content>
      </React.Fragment>
    );
  }
}

export default hot(module)(About);
