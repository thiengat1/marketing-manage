/*
 * @Description:commission
 * @Author: code pro
 * @Date: 2022-06-18 21:06:25
 * @LastEditTime: 2022-06-18 21:09:04
 * @LastEditors: code pro
 */
import request from "../request";

export const listApi = {
  getAgentConfigUrl: "/user/get-agency-config",
};

// create config
export function createCommissionConfig(data) {
  return request({
    url: "/user/create-agency-config",
    method: "post",
    data: data,
  });
}
// edit config
export function updateCommissionConfig(data) {
  return request({
    url: "/user/update-agency-config",
    method: "post",
    data: data,
  });
}
// delete config
export function deleteCommissionConfig(data) {
  return request({
    url: "/user/delete-agency-config",
    method: "post",
    data: data,
  });
}
