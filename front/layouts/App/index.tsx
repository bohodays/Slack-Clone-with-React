import React from 'react';
import loadable from '@loadable/component';
import { Switch, Route, Redirect } from 'react-router-dom';

// 코드 스플리팅
const LogIn = loadable(() => import('@pages/LogIn'));
const SignUp = loadable(() => import('@pages/SignUp'));
// const Channel = loadable(() => import('@pages/Channel'));
// const DirectMessage = loadable(() => import('@pages/DirectMessage'))
const Workspace = loadable(() => import('@layouts/Workspace'))

const App = () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/login" />
      <Route path="/login" component={LogIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/workspace/:workspace" component={Workspace} />      {/** path에 :는 라우트 파라미터를 의미한다. 유저가 자유롭게 값을 바꿀 수 있는 부분이다 */}

      {/* <Route path="/workspace/channel" component={Channel} />
      <Route path="/workspace/dm" component={DirectMessage} /> */}
    </Switch>
  );
};

export default App;
