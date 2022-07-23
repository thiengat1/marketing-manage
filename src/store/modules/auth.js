/*
 * @Description:用户验证
 * @Author: code pro
 * @Date: 2022-05-31 13:32:21
 * @LastEditTime: 2022-06-25 23:13:58
 * @LastEditors: code pro
 */
import {
  getToken,
  setToken,
  setUsername,
  getUsername,
  setIsCaptcha,
  getIsCaptcha,
  removeToken,
  removeUsername,
} from '@/utils/auth';
import { login, logout, getInfo } from '@/api/user/auth';
import { setToast } from '@/utils/auth';

const state = {
  token: getToken(),
  name: '',
  username: getUsername(),
  isCaptcha: getIsCaptcha(),
  globalLoading: false,
  globalToast: {},
  userId: null,
  userType: null,
};

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token;
  },
  SET_USER_NAME: (state, username) => {
    state.username = username;
  },
  SET_IS_CAPTCHA: (state, isCaptcha) => {
    state.isCaptcha = isCaptcha;
  },
  SET_LOADING: (state, payload) => {
    state.globalLoading = payload;
  },
  SET_GLOBAL_TOAST: (state, payload) => {
    state.globalToast = payload;
  },
  SET_NAME: (state, name) => {
    state.name = name;
  },
  SET_USER_ID: (state, id) => {
    state.userId = id;
  },
  SET_USER_TYPE: (state, type) => {
    state.userType = type;
  },
};

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password, captcha } = userInfo;
    return new Promise((resolve, reject) => {
      login({
        username: username.trim(),
        password: password,
        key: captcha ? captcha.key : null,
        captcha: captcha ? captcha.value : null,
      })
        .then((response) => {
          const { data } = response;

          // 如果登入5次失败，需要输入captcha
          // eslint-disable-next-line no-prototype-builtins
          if (data.hasOwnProperty('isCaptcha')) {
            commit('SET_IS_CAPTCHA', data.isCaptcha);
            setIsCaptcha(data.isCaptcha);
            setToast({
              type: 'error',
              code: 'login fail!',
              message: '账户或密码错误',
            });
            return;
          }

          // 如果登入成功就更新isCaptcha状态
          commit('SET_IS_CAPTCHA', false);
          setIsCaptcha(false);

          commit('SET_TOKEN', data);
          commit('SET_USER_NAME', username.trim());
          setUsername(username.trim());
          setToken(data);
          resolve();
        })
        .catch((error) => {
          if (error.code === -1000003) {
            commit('SET_IS_CAPTCHA', true);
            setIsCaptcha(true);
          }

          reject(error);
        });
    });
  },
  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          commit('SET_TOKEN', '');
          removeToken();
          removeUsername();
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo()
        .then((response) => {
          const { data } = response;

          if (!data) {
            reject('Verification failed, please Login again.');
          }
          const { name, username, id, types } = data;
          commit('SET_NAME', name);
          commit('SET_USER_ID', id);
          commit('SET_USER_NAME', username);
          commit('SET_USER_TYPE', types);

          setUsername(username);
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },

  setLoading({ commit }, payload) {
    commit('SET_LOADING', payload);
  },
  setToast({ commit }, payload) {
    commit('SET_GLOBAL_TOAST', payload);
  },
};

const getters = {
  isCaptcha(state) {
    return state.isCaptcha;
  },
  globalLoading(state) {
    return state.isCaptcha;
  },
  globalToast(state) {
    return state.globalError;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
