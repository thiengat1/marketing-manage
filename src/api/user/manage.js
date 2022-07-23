/*
 * @Description: user manage
 * @Author: code pro
 * @Date: 2022-06-15 21:42:40
 * @LastEditTime: 2022-06-25 19:32:37
 * @LastEditors: Ian
 */
import request from '../request';

export const listApi = {
  userAllListUrl: '/user/all',
};

// create user
export function createUser(data) {
  return request({
    url: '/user/create-account',
    method: 'post',
    data: data,
  });
}
//delete user
export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data: data,
  });
}
//update password
export function updatePassword(data) {
  return request({
    url: '/user/password/update',
    method: 'post',
    data: data,
  });
}
//reset password
export function resetPassword(data) {
  return request({
    url: '/user/password/reset',
    method: 'post',
    data: data,
  });
}
//update another password
export function updateAnotherUserPassword(data) {
  return request({
    url: '/user/password/update-user-password',
    method: 'post',
    data: data,
  });
}
//update account type
export function updateAccountTypes(data) {
  return request({
    url: '/user/update-account-type',
    method: 'post',
    data: data,
  });
}
