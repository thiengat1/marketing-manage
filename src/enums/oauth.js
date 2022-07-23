/*
 * @Description: 登入枚举
 * @Author: code pro
 * @Date: 2022-06-03 13:25:16
 * @LastEditTime: 2022-06-25 23:11:50
 * @LastEditors: code pro
 */

// localStorage的token,name,username key
export const oauthLoginWithTokenKey = 'login-with-token-key';

export const oauthHostAddr = process.env.VUE_APP_OA_HOST_ADDRESS;

export const oauthLoginAddr = `${oauthHostAddr}/#/third-party-login`;
