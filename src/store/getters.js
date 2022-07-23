/*
 * @Description: getters
 * @Author: code pro
 * @Date: 2022-06-07 17:57:41
 * @LastEditTime: 2022-06-13 23:14:36
 * @LastEditors: code pro
 */
const getters = {
  userType: (state) => state.auth.userType,
  name: (state) => state.auth.name,
};
export default getters;
