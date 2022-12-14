import useInput from '@hooks/useInput';
import { Success, Form, Error, Label, Input, LinkContainer, Button, Header } from '@pages/SignUp/style';
import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { useCallback, useState } from 'react';
import { Link, Redirect } from 'react-router-dom';
import useSWR from 'swr';

const LogIn = () => {
  // swr을 사용하는 이유: 프론트엔드 개발자는 로그인 정보(로그인 여부 등)를 여러 곳에서 사용해야 되기 때문에 로그인 정보를 저장해두어야 한다.
  // fetcher 앞의 api가 fetcher의 매개변수로 들어가서 실행된다.
  // data가 존재하지 않으면 로딩 중이다.
  // mutate는 swr을 내가 원할 때 호출하게 해준다. 아래의 코드에서는 로그인이 되어있으면 채널로 이동시키는 역할을 한다.
  // 여러 옵션들이 많기 때문에 공식 문서를 참고하자.
  // 주로 사용하는 것이 dedupingInterval (서버에 요청을 많이 하면 무리가 가기 때문에 사용)
  // 비로그인시 data는 false다.
  const {data, error, mutate} = useSWR('http://localhost:3095/api/users', fetcher);       // 로그인 후에 데이터를 전해줄 API (API 리스트에 별도의 api 존재. get 방식)

  const [logInError, setLogInError] = useState(false);
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const onSubmit = useCallback(
    (e) => {
      e.preventDefault();
      setLogInError(false);
      axios.post(
          'http://localhost:3095/api/users/login',
          { email, password },
          // post 방식에서는 세 번째에 넣어주어야 한다. (get 방식일 때는 두 번째)
          { withCredentials: true, },
        )
        .then((response) => {
          // 로그인에 성공하면 swr을 호출해서 data를 true로 변경한다.
          // mutate는 서버에 요청하기 전에 데이터를 바꿔버리고 요청을 나중에 보낸다. 유저의 사용성이 좋아진다. (optimistic ui)
          // 먼저 성공한다고 가정하고 데이터를 바꾼 뒤 점검하겠다.... 점검을 했는데 성공하면 넘어가고, 실패했으면 조치를 취한다.
          mutate(response.data, false);
        })
        .catch((error) => {
          setLogInError(error.response?.data?.statusCode === 401);
        });
    },
    [email, password],
  );

  if (data === undefined) {
    return <div>로딩중...</div>;
  }

  // if (data) {
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }
  if (data) {
    return <Redirect to="/workspace/channel" />;
  }

  // console.log(error, userData);
  // if (!error && userData) {
  //   console.log('로그인됨', userData);
  //   return <Redirect to="/workspace/sleact/channel/일반" />;
  // }

  return (
    <div id="container">
      <Header>Sleact</Header>
      <Form onSubmit={onSubmit}>
        <Label id="email-label">
          <span>이메일 주소</span>
          <div>
            <Input type="email" id="email" name="email" value={email} onChange={onChangeEmail} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
          {logInError && <Error>이메일과 비밀번호 조합이 일치하지 않습니다.</Error>}
        </Label>
        <Button type="submit">로그인</Button>
      </Form>
      <LinkContainer>
        아직 회원이 아니신가요?&nbsp;
        <Link to="/signup">회원가입 하러가기</Link>
      </LinkContainer>
    </div>
  );
};

export default LogIn;
