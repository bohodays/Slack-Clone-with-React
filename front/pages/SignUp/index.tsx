import useInput from '@hooks/useInput';
import React, { useCallback, useState } from 'react';
import axios from 'axios';
import { Form, Success, Error, Label, Input, LinkContainer, Button, Header } from './style';

const SingUp = () => {
  // const [email, setEmail] = useState('');
  // const [nickname, setNickname] = useState('');
  const [email, onChangeEmail] = useInput('');                         // 커스텀 훅 적용
  const [nickname, onChangeNickname] = useInput('');                   // 커스텀 훅 적용
  const [password, setPassword] = useState('');
  const [passwordCheck, setPasswordCheck] = useState('');
  const [mismatchError, setMissmatchError] = useState(false);
  const [signUpError, setSignUpError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  // 반복되는 구조는 커스텀 훅을 만들어서 간단하게 만들자 (중복 제거)
  // const onChangeEmail = useCallback((event) => {
  //   setEmail(event.target.value);
  // }, []);

  // const onChangeNickname = useCallback((event) => {
  //   setNickname(event.target.value);
  // }, []);

  const onChangePassword = useCallback((event) => {
    setPassword(event.target.value);
    setMissmatchError(event.target.value !== passwordCheck);
  }, [passwordCheck]);

  const onChangePasswordCheck = useCallback((event) => {
    setPasswordCheck(event.target.value);
    setMissmatchError(event.target.value !== password);
  }, [password]);

  const onSubmit = useCallback((event) => {
    event.preventDefault();
    if (!mismatchError) {
      console.log('서버로 회원가입하기');
      // 비동기 요청 전에 setState를 초기화해주는 것이 좋다.
      // 요청을 연달아할 때 첫번째 요청때 남아있던 결과가 두번째 요청에도 똑같이 표시되는 문제가 발생하는 것을 방지
      setSignUpError('');
      setSignUpSuccess(false);
      axios.post('http://localhost:3095/api/users', {                  // 이 부분은 백엔드에게 물어봐야 한다. 물어보면 API 리스트를 줄 것이다. API.md 참고
        email, 
        nickname, 
        password,
      })
        .then((response) => {
          console.log(response);
          setSignUpSuccess(true);
        })
        .catch((error) => {
          console.log(error.response);
          setSignUpError(error.response.data);
        })
        .finally(() => {});
    }
  }, [email, nickname, password, passwordCheck, mismatchError]);       // deps에 함수 안에서 쓰이는 변수들을(state) 넣어주어야 값이 변한다. (함수 기준으로 외부 변수일때만)

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
        <Label id="nickname-label">
          <span>닉네임</span>
          <div>
            <Input type="text" id="nickname" name="nickname" value={nickname} onChange={onChangeNickname} />
          </div>
        </Label>
        <Label id="password-label">
          <span>비밀번호</span>
          <div>
            <Input type="password" id="password" name="password" value={password} onChange={onChangePassword} />
          </div>
        </Label>
        <Label id="password-check-label">
          <span>비밀번호 확인</span>
          <div>
            <Input
              type="password"
              id="password-check"
              name="password-check"
              value={passwordCheck}
              onChange={onChangePasswordCheck}
            />
          </div>
          {mismatchError && <Error>비밀번호가 일치하지 않습니다.</Error>}
          {!nickname && <Error>닉네임을 입력해주세요.</Error>}
          {signUpError && <Error>{signUpError}</Error>}
          {signUpSuccess && <Success>회원가입되었습니다! 로그인해주세요.</Success>}
        </Label>
        <Button type="submit">회원가입</Button>
      </Form>
      <LinkContainer>
        이미 회원이신가요?&nbsp;
        {/* <Link to="/login">로그인 하러가기</Link> */}
      </LinkContainer>
    </div>
  );
}

export default SingUp;