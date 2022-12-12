import { Dispatch, SetStateAction, useCallback, useState } from 'react';

// 커스텀 훅: 리액트에서 제공하는 hook들을 하나로 합쳐서 새로운 hook을 만드는 것
// 어떤 타입의 매개변수가 들어올지 모를 떄는 제너릭이라는 타입 변수를 만들어서 이용한다.
const useInput = <T = any>(initialData: T): [T, (e: any) => void, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((event) => {
    setValue(event.target.value);
  }, [])
  return [value, handler, setValue];
};

export default useInput;