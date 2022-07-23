/*
 * @Description:app setting
 * @Author: code pro
 * @Date: 2022-06-14 11:58:56
 * @LastEditTime: 2022-06-25 23:14:03
 * @LastEditors: code pro
 */

const state = {
  scrollHeight: 0,
};

const mutations = {
  SET_SCROLL_HEIGHT: (state, payload) => {
    state.scrollHeight = payload;
  },
};

const actions = {
  setScrollHeight({ commit }) {
    handleSetScrollHeight(commit);
  },
};

const getters = {
  scrollHeight(state) {
    return state.scrollHeight;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};

// set scroll height
function handleSetScrollHeight(commit) {
  setScrollHeightByWidth(commit);
  window.addEventListener('resize', () => {
    setScrollHeightByWidth(commit);
  });
}

function setScrollHeightByWidth(commit) {
  let h = window.innerHeight;
  let w = window.innerWidth;
  var height = (h - 300) * 1;
  if (w <= 960) {
    commit('SET_SCROLL_HEIGHT', 0);
  } else {
    commit('SET_SCROLL_HEIGHT', height);
  }
}
