// vuex
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  username: ''
}
const mutations = {
  setUserName (state, username) {
    state.username = username
    localStorage.setItem('myusername', username)
  },
  getUserName (state) {
    return state.username
  }
}
const actions = {
  setUserNameAction: ({ commit }, username) => {
    commit('setUserName', username)
  },
  getUserNameAction: ({ commit }) => {
    commit('getUserName')
  }
}
const getters = {
  getUserName: (state) => {
    return localStorage.getItem('myusername')
  }
}
export default new Vuex.Store({
  strict: true, // 如果添加了严格模式,那么直接修改state中的数据会报错: Error: [vuex] Do not mutate vuex store state outside mutation handlers.
  state,
  getters,
  actions,
  mutations
})
