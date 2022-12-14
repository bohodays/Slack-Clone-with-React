import Workspace from '@layouts/Workspace';
import React from 'react';

const DirectMessage = () => {
  return (
    // Workspace로 div를 감싸면 div태그가 Workspace의 children이 된다.
    <Workspace>
      <div>DM!</div>
    </Workspace>
  );
}

export default DirectMessage;