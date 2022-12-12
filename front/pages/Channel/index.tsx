import Workspace from '@layouts/Workspace';
import React from 'react';

const Channel = () => {
  return (
    // Workspace로 div를 감싸면 div태그가 Workspace의 children이 된다.
    <Workspace>
      <div>로그인하신 것을 축하드려요!</div>
    </Workspace>
  );
}

export default Channel;