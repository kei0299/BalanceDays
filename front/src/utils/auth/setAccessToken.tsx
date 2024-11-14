import { setCookie } from 'nookies'

export const setAccessTokenAction = (
  accessToken: string,
  client: string,
  uid: string,
) => {
  setCookie(null, 'access-token', accessToken, { maxAge: 30 * 24 * 60 * 60, path: '/' })  // 30日間の有効期限
  setCookie(null, 'client', client, { maxAge: 30 * 24 * 60 * 60, path: '/' })
  setCookie(null, 'uid', uid, { maxAge: 30 * 24 * 60 * 60, path: '/' })
}
