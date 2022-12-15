import React, { CSSProperties, FC, useCallback } from 'react';
import { CloseModalButton, CreateMenu } from './styles';

interface Props {
  show: boolean;
  onCloseModal: (e: any) => void;
  style: CSSProperties;
  closeButton?: boolean;
}

// 재사용하기 위해 Menu를 컴포넌트로 만들었음
// 타입을 적지 않으면 에러 발생 (타입스크립트인 경우)
// FC 뒤에 제네릭(<>)으로 타입을 지정해주어야 한다.
const Menu: FC<Props> = ({ children, style, show, onCloseModal, closeButton }) => {
  const stopPropagation = useCallback((e) => {
    e.stopPropagation();
  }, []);

  if (!show) {
    return null;
  }

  return (
    // 부모 요소에 onCloseModal을 넣고 자식 요소에 stopPropagation을 넣은 것은 메뉴를 클릭하면 닫히지 않고 메뉴 이외의 영역을 클릭하면 메뉴를 닫히게 하기 위함이다.
    <CreateMenu onClick={onCloseModal}>
      <div style={style} onClick={stopPropagation}>
        {closeButton && <CloseModalButton onClick={onCloseModal}>&times;</CloseModalButton>}      {/** &times; 를 적으면 x 마크가 생긴다. */}
        {children}
      </div>
    </CreateMenu>
  );
};

// props된 closeButton를 기본값 처리하기 위한 코드! 작성하지 않으면 정상적으로 실행되지 않는다. 
Menu.defaultProps = {
  closeButton: true,
};

export default Menu;