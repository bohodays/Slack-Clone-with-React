import io from 'socket.io-client';
import { useCallback } from 'react';

const backUrl = 'http://localhost:3095';

// sockets.emit('hello', 'world')    // 서버쪽에 hello라는 이벤트 이름으로 world라는 데이터를 보냄
// sockets.on('message', (data) => { // hooks나 서버쪽에서 프론트로 데이터가 오면 'message'라는 이름으로 콜백함수 실행

// })

const sockets: { [key: string]: SocketIOClient.Socket } = {};
const useSocket = (workspace?: string): [SocketIOClient.Socket | undefined, () => void] => {
  console.log('rerender', workspace);
  const disconnect = useCallback(() => {
    if (workspace) {
      sockets[workspace].disconnect();
      delete sockets[workspace];
    }
  }, [workspace]);
  if (!workspace) {
    return [undefined, disconnect];
  }
  if (!sockets[workspace]) {
    sockets[workspace] = io.connect(`${backUrl}/ws-${workspace}`, {
      transports: ['websocket'],
    });
  }

  return [sockets[workspace], disconnect];
};

export default useSocket;
