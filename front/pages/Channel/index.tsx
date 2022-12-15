import React from 'react';
import { Container, Header } from './style';

const Channel = () => {
  return (
    // Workspace로 div를 감싸면 div태그가 Workspace의 children이 된다.
    <Container>
      <Header>채널!</Header>
    </Container>
  );
}

export default Channel;