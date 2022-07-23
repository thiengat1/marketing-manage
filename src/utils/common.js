/*
 * @Description:common
 * @Author: code pro
 * @Date: 2022-06-19 18:54:11
 * @LastEditTime: 2022-06-19 20:27:53
 * @LastEditors: code pro
 */
//number with commas
export function numberWithCommas(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function getNowDate() {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth();
  var date = now.getDate();
  month = month + 1;
  month = month.toString().padStart(2, "0");
  date = date.toString().padStart(2, "0");
  return `${year}-${month}-${date}`;
}

export function convertToMonth(value) {
  var now = new Date(value);
  var year = now.getFullYear();
  var month = now.getMonth();
  month = month + 1;
  month = month.toString().padStart(2, "0");
  return `${year}-${month}`;
}
