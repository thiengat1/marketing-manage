/*
 * @Description: api
 * @Author: code pro
 * @Date: 2022-06-15 22:01:41
 * @LastEditTime: 2022-06-15 22:01:47
 * @LastEditors: code pro
 */

import request from './request'

export function initData(url, params) {
  return request({
    url: url,
    method: 'get',
    params
  })
}
