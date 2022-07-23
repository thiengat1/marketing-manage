import request from '../request';

// login
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data: data,
  });
}
// logout
export function logout(data) {
  return request({
    url: '/auth/logout',
    method: 'post',
    data: data,
  });
}
// get captcha
export function createCaptcha(params) {
  return request({
    url: '/captcha/create',
    method: 'get',
    params,
  });
}

//get user info
export function getInfo(params) {
  return request({
    url: '/auth/info',
    method: 'get',
    params,
  });
}
