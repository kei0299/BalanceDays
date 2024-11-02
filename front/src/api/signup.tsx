import axios from 'axios';
import { usersIndex } from '../urls/index'

export const userDataCreate = async(params, dispatch) => {
  await axios.post(usersIndex, params)
  .then(data => {
    console.log(data)

    // 取得したresponseより、アクセストークンなどを変数に代入
    const accessToken = data.headers['access-token'];
    const client = data.headers['client'];
    const uid = data.headers['uid'];

    // 認証情報をlocalStorageに保存する
    localStorage.setItem('access-token', accessToken);
    localStorage.setItem('client', client);
    localStorage.setItem('uid', uid);

  }).catch(error => {
    console.log(error);
  });
};