import fetcher from '@utils/fetcher';
import axios from 'axios';
import React, { FC, useCallback } from 'react';
import { Redirect } from 'react-router';
import useSWR from 'swr';

const Workspace: FC = ({children}) => {
  const {data, error, mutate} = useSWR('http://localhost:3095/api/users', fetcher, {
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

  if (!data) {
    return <Redirect to="/login" />
  }
  
  return (
    <div>
      <button onClick={onLogout}>로그아웃</button>
      {children}
    </div>
  )
}

export default Workspace;

