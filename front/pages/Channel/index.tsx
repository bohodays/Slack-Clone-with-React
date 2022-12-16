import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import React, { useCallback } from 'react';
import { Container, Header } from './style';

const Channel = () => {
  const [chat, onChangeChat, setChat] = useInput('');
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    console.log('submit');
    
    setChat('');
  }, []);

  return (
    // Workspace로 div를 감싸면 div태그가 Workspace의 children이 된다.
    <Container>
      <Header>채널!</Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
}

export default Channel;