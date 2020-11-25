import Cookies from 'js-cookie';

export function getAccessToken() {
  return Cookies.get('at');
}
