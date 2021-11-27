import Vue from 'vue' // 导入 Vue 模块，准备将 vuex 挂载给 Vue
import Vuex from 'vuex' // 导入 vuex 模块

Vue.use(Vuex) // 挂载 vuex

// 创建 vuex 对象
const store = new Vuex.Store({
  // 1、vuex 数据
  state: {
    user: JSON.parse(window.localStorage.getItem('user')) || null // 用户登录城后，保存用户信息（初始值尝试读取本地存储的用户信息）
  },
  // 2、同步修改 state 的方法
  mutations: {
    // 用户登录成功，存储用户信息
    saveUserInfo(state, payload) {
      // 1、payload 是获取的用户信息，是一个 JSON 数据，需要将 payload 转换成对象形式进行存储
      state.user = JSON.parse(payload)

      // 2、每次刷新页面，用户信息会被清空，将用户信息存储在本地中
      // 本地存储只能存储 JSON 格式，所以存储本地的时候，不需要将用户信息转换为对象格式
      window.localStorage.setItem('user', payload)
    },
    // 用户退出，清除本地存储的用户信息
    userLogout(state) {
      // 清空 vuex 中存储的用户信息
      state.user = null

      // 清空本地的 user 数据
      window.localStorage.removeItem('user')
    }
  },
  // 3、异步修改 state 的方法
  actions: {},
  modules: {}
})

export default store // 导出创建的 vuex 对象
