/*
 * @Description:agent manage
 * @Author: code pro
 * @Date: 2022-06-18 21:06:25
 * @LastEditTime: 2022-06-19 19:57:50
 * @LastEditors: code pro
 */
import request from "../request";

export const listApi = {
  getAgentManageUrl: "/user/get-agency-details",
};

// create agent manage
export function createAgentManage(data) {
  return request({
    url: "/user/create-agency-details",
    method: "post",
    data: data,
  });
}
// edit agent manage
export function updateAgentManage(data) {
  return request({
    url: "/user/update-agency-details",
    method: "post",
    data: data,
  });
}
// delete agent manage
export function deleteAgentManage(data) {
  return request({
    url: "/user/delete-agency-details",
    method: "post",
    data: data,
  });
}
// get win loss total
export function getWinLossTotal(params) {
  return request({
    url: "/user/get-total-win-lose",
    method: "get",
    params,
  });
}
// get win loss total
export function getCommissionTotal(params) {
  return request({
    url: "/user/get-total-commission",
    method: "get",
    params,
  });
}
// import excel
export function importExcel(data) {
  return request({
    url: "/user/import-agency-details",
    method: "post",
    data: data,
  });
}
