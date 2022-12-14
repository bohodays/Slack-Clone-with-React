import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback, useState } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';
import { AddButton, Channels, Chats, Header, LogOutButton, MenuScroll, ProfileImg, ProfileModal, RightMenu, WorkspaceButton, WorkspaceName, Workspaces, WorkspaceWrapper } from './styles';
import gravatar from 'gravatar';
import Menu from '@components/Menu';
import { Link } from 'react-router-dom';
import { IUser } from 'typings/db';
import { Button, Input, Label } from '@pages/SignUp/style';
import useInput from '@hooks/useInput';
import Modal from '@components/Modal';
import { toast } from 'react-toastify';

const Workspace: FC = ({children}) => {
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [newWorkspace, onChangeNewWorkspace, setNewWorkspace] = useInput('');
  const [newUrl, onChangeNewUrl, setNewUrl] = useInput('');

  const {data, error, mutate} = useSWR<IUser | false>('http://localhost:3095/api/users', fetcher, {   // <IUser | false> 라고 작성하는 이유는 로그인 안되어있으면 false가 나올수도 있기 때문이다.
    dedupingInterval: 1000,     // 1초 내에 또 요청이 오면 캐시에 저장된 데이터를 사용한다.
  }); 
  
  const onLogout = useCallback(() => {
    axios.post('http://localhost:3095/api/users/logout', null, {
      // 백엔드와 프론트가 서로 쿠키를 교환하기 위해 아래의 설정을 해주어여 한다.
      withCredentials: true,
    })
      .then(() => {
        mutate(false, false);
      });
  }, []);

  // 토글 함수
  const onClickUserProfile = useCallback(() => {
    setShowUserMenu((prev) => !prev);
  }, []);

  const onClickCreateWorkspace = useCallback(() => {
    setShowCreateWorkspaceModal(true);
  }, []);

  const onCreateWorkspace = useCallback((e) => {
    e.preventDefault();
    
    if (!newWorkspace || !newWorkspace.trim()) return;    // 필수값들 입력받았는지 검사 (trim을 해주어야 띄어쓰기해도 통과하지 못하게한다.)
    if (!newUrl || !newUrl.trim()) return;                // 필수값들 입력받았는지 검사
    
    axios.post('http://localhost:3095/api/workspaces', {
      workspace: newWorkspace,
      url: newUrl,
    }, {
      withCredentials: true,
    })
      .then(() => {
        mutate();
        setShowCreateWorkspaceModal(false);
        setNewWorkspace('');
        setNewUrl('');
      })
      .catch((error) => {
        console.dir(error);
        toast.error(error.response?.data, { position: 'bottom-center' });
      })
  }, [newWorkspace, newUrl]);

  const onCloseUserProfile = useCallback((e) => {
    e.stopPropagation();
    setShowUserMenu(false);
  }, []);

  const onCloseModal = useCallback(() => {
    setShowCreateWorkspaceModal(false);
  }, []);

  if (!data) {
    return <Redirect to="/login" />
  }
  
  return (
    <div>
      <Header>
        <RightMenu>
          <span onClick={onClickUserProfile}>
            <ProfileImg src={gravatar.url(data.email, { s: '28px', d: 'retro' })} alt={data.nickname} />
            {showUserMenu && (
              <Menu style={{ right: 0, top: 38 }} show={showUserMenu} onCloseModal={onCloseUserProfile}>
                <ProfileModal>
                  <img src={gravatar.url(data.email, { s: '36px', d: 'retro' })} alt={data.nickname} />
                  <div>
                    <span id='profile-name'>{data.nickname}</span>
                    <span id='profile-active'>Active</span>
                  </div>
                </ProfileModal>
                <LogOutButton onClick={onLogout}>로그아웃</LogOutButton>
              </Menu>
            )}
          </span>
        </RightMenu>
      </Header>
      <WorkspaceWrapper>
        <Workspaces>
          {data?.Workspaces.map((ws) => {
            return (
              <Link key={ws.id} to={`/workspace/${123}/channel/일반`}>
                <WorkspaceButton>{ws.name.slice(0, 1).toUpperCase()}</WorkspaceButton>
              </Link>
            );
          })}
          <AddButton onClick={onClickCreateWorkspace}>+</AddButton>
        </Workspaces>
        <Channels>
          <WorkspaceName>Sleact</WorkspaceName>
          <MenuScroll>menu scroll</MenuScroll>
        </Channels>
        <Chats>
          {children}
        </Chats>
      </WorkspaceWrapper>
      {/* Input은 컴포넌트로 나누는 것이 좋다. 값을 입력할 때마다 Input이 state를 변경해서 리렌더링하기 때문 */}
      <Modal show={showCreateWorkspaceModal} onCloseModal={onCloseModal}>
        <form onSubmit={onCreateWorkspace}>
          <Label id='workspace-label'>
            <span>워크스페이스 이름</span>
            <Input id="workspace" value={newWorkspace} onChange={onChangeNewWorkspace} />
          </Label>
          <Label id='workspace-url-label'>
            <span>워크스페이스 url</span>
            <Input id="workspace" value={newUrl} onChange={onChangeNewUrl} />
          </Label>
          <Button type="submit">생성하기</Button>
        </form>
      </Modal>
    </div>
  )
}

export default Workspace;

