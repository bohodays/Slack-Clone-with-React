import { Dispatch, SetStateAction, useCallback, useState, ChangeEvent } from 'react';

// 커스텀 훅: 리액트에서 제공하는 hook들을 하나로 합쳐서 새로운 hook을 만드는 것
// 어떤 타입의 매개변수가 들어올지 모를 떄는 제너릭이라는 타입 변수를 만들어서 이용한다.

type ReturnTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];

const useInput = <T>(initialData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initialData);
  const handler = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setValue((e.target.value as unknown) as T);
  }, []);
  return [value, handler, setValue];
};

export default useInput;
