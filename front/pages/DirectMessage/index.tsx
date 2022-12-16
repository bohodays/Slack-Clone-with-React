import React, { useCallback } from 'react';
import { Container, Header } from './styles';
import gravatar from 'gravatar';
import useSWR from 'swr';
import fetcher from '@utils/fetcher';
import { useParams } from 'react-router';
import { stringify } from 'querystring';
import ChatBox from '@components/ChatBox';
import ChatList from '@components/ChatList';
import useInput from '@hooks/useInput';
import axios from 'axios';
import { IDM } from '@typings/db';

const DirectMessage = () => {
  const {workspace, id} = useParams<{ workspace: string, id: string }>();
  const { data: userData } = useSWR(`http://localhost:3095/api/workspaces/${workspace}/users/${id}`, fetcher);     // 상대방 데이터
  const { data: myData } = useSWR(`http://localhost:3095/api/users`, fetcher);     // 상대방 데이터
  const [chat, onChangeChat, setChat] = useInput('');
  const { data: chatData, mutate: mutateChat } = useSWR<IDM[]>(
    `http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats?perPage=20&page=1`,
    fetcher,
  );

  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if (chat?.trim()) {
      axios.post(`http://localhost:3095/api/workspaces/${workspace}/dms/${id}/chats`, {
        content: chat,
      }, {
        withCredentials: true,
      })
        .then(() => {
          mutateChat();
          setChat('');
        })
        .catch(console.error);
    }
  }, [chat]);

  if (!userData || !myData) {
    return null;
  }

  return (
    // Workspace로 div를 감싸면 div태그가 Workspace의 children이 된다.
    // <div>DM!</div>
    <Container>
      <Header>
        <img src={gravatar.url(userData.email, {s: '24px', d: 'retro'})} alt={userData.nickname} />
        <span>{userData.nickname}</span>
      </Header>
      <ChatList />
      <ChatBox chat={chat} onChangeChat={onChangeChat} onSubmitForm={onSubmitForm} />
    </Container>
  );
}

export default DirectMessage;