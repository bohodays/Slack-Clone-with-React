import axios from 'axios';

const fetcher = (url: string) =>
  axios
    .get(url, {
      // 프론트 서버 주소와 백엔드 서버 주소가 다르면 쿠키가 전달이 안된다. 그래서 아래의 설정을 해주어야 한다.
      withCredentials: true,
    })
    .then((response) => response.data);

export default fetcher;
