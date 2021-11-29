// 用于发送请求操作
import axios from 'axios' // 导入 axios 网络模块

import store from '@/store' // 导入 vuex 数据

// 通过局部引入方式，引入 elementUI 的 Message 组件功能
import { Message } from 'element-ui'

// 引入 router
import router from '@/router'

// 导入 qs 模块，用于处理请求参数的格式
import qs from 'qs'

// 创建 axios 的实例
const request = axios.create({
  // timeout: 2000 // 请求超时 2000ms
})

// 封装一个请求处理 baseURL 的方法
function getBaseURL(url) {
  if (url.startsWith('/front')) {
    return 'http://edufront.lagou.com'
  } else if (url.startsWith('/boss')) {
    return 'http://eduboss.lagou.com'
  }
}

// 设置请求拦截器，因为前台请求的接口地址和后台请求的接口地址不一样
// 所以在发送请求的时候，对接口地址进行拦截处理
request.interceptors.request.use((config) => {
  // 判断 config.url 的前缀，来进行请求 baseURL 的设置
  config.baseURL = getBaseURL(config.url)

  // 统一设置请求头的 token 信息
  const { user } = store.state
  if (user && user.access_token) {
    config.headers.Authorization = user.access_token
  }

  return config // 返回请求的信息
})

// 封装一个跳转到登录页面的函数
function redirectLogin() {
  // 跳转路由到登录页面
  router.push({
    name: 'Login',
    // 当前访问的页面察觉到没有 Token 退出到登录页后，需要将刚才的页面做一个缓存，待会再跳转回去
    query: {
      // currentRoute 相当于存储了路由信息的对象，等同于 $route
      redirect: router.currentRoute.fullPath
    }
  })
}

// 存储当前是否正在更新 token 的一个状态
let isRefreshing = false // eslint-disable-line no-unused-vars
// 存储因为等待 token 刷新而挂起的请求，最后需要统一执行
let requestArr = [] // eslint-disable-line no-unused-vars

// 设置响应拦截器
request.interceptors.response.use(
  // 状态码 2XX（请求成功）执行
  function (response) {
    // console.log('响应成功：', response)
    return response
  },
  // 状态码超出 2XX（请求失败）执行
  function (error) {
    if (error.response) {
      // 请求发送成功，响应接受完毕，但是状态码失败的情况
      const { status } = error.response // 获取状态码
      // 初始化错误信息
      let errorMessage = '' // eslint-disable-line no-unused-vars

      // 判断状态码，不同的状态码进行不一样的处理
      if (status === 400) {
        errorMessage = '请求参数错误！'
      } else if (status === 401) {
        // 1、不存在 Token 的情况
        if (!store.state.user) {
          // 调用跳转到登录页面的函数
          redirectLogin()

          // 符合该情况后，后面的将不再执行，直接返回错误信息
          return Promise.reject(error)
        }

        // 如果同时有多个请求报错了，为了防止重复获取 token，需要进行一个判断
        // 当前存在正在刷新 token 的请求，直接 return，阻止后面再次发送获取新的 token 的请求
        if (isRefreshing) {
          // 将当前失败的请求，存储到请求列表中
          requestArr.push(() => {
            // 当前函数调用后，会自动发送本次失败的请求
            request(error.config)
          })
          return
        }

        // 如果需要发送获取新的 token 的请求，别忘了将 isRefreshing 变为 true
        isRefreshing = true

        // 2、Token 无效（过期）的处理
        // 发送刷新 Token 的请求，获取新的 access_token
        return request({
          method: 'POST',
          url: '/front/user/refresh_token',
          data: qs.stringify({
            // 注意接口文档中，refresdtoken 关键字没有下划线，而返回的数据需要加下划线
            refreshtoken: store.state.user.refresh_token
          })
        })
          .then((res) => {
            // 判断是否请求到新的 access_token，这时候分两种情况讨论
            // 1、对用户请求新的 token 时失败的处理
            if (res.data.state !== 1) {
              // 清除无效的用户信息
              store.commit('saveUserInfo', null)

              // 调用跳转到登录页面的函数
              redirectLogin()

              // 符合该情况后，后面的将不再执行，直接返回错误信息
              return Promise.reject(error)
            }

            // 2、对用户请求新的 token 成功的时候的处理
            //  2.1 将响应到的新的数据存储到本地
            store.commit('saveUserInfo', res.data.content)
            //  2.2 重新发送刚才失败的请求（根据 requestArr 数组，发送所有失败的请求）
            requestArr.forEach((callback) => callback())
            //  2.3 将所有失败的请求发送完毕之后，清除 requestArr 数组的内容即可
            requestArr = []
            //  2.4 将本次请求发送（注意，本次请求并没有存在 requestArr 中，因为第一次的请求其获取 token 的请求是成功的）
            return request(error.config)
          })
          .catch((err) => {
            console.log(err)
          })
          .finally(() => {
            // finally 表示 Prosmise 对象不论是否成功都会调用
            // 获取新的 token 的请求发送完毕，将刷新 token 的状态改为 false 即可，以便下次再出现获取失败的情况
            isRefreshing = false
          })
      } else if (status === 403) {
        errorMessage = '没有权限，请联系管理员！'
      } else if (status === 404) {
        errorMessage = '请求资源不存在！'
      } else if (status >= 500) {
        errorMessage = '服务端错误，请联系管理员！'
      }

      // 将错误信息通过 elementUI 的 Message 组件提示出来
      Message.error({
        type: 'error', // 提示框类型
        message: errorMessage, // 提示框信息
        duration: 1250 // 提示框持续时间
      })
    } else if (error.request) {
      // 请求发送成功，但是未收到响应
      // 将错误信息通过 elementUI 的 Message 组件提示出来
      Message.error({
        type: 'error', // 提示框类型
        message: '请求超时，请重新操作', // 提示框信息
        duration: 1250 // 提示框持续时间
      })
    } else {
      // 一些意料之外的错误
      // 将错误信息通过 elementUI 的 Message 组件提示出来
      Message.error({
        type: 'error', // 提示框类型
        message: error.message, // 提示框信息
        duration: 1250 // 提示框持续时间
      })
    }

    // 将本次请求的错误对象，继续向后抛出，让接收响应的处理函数进行操作
    return Promise.reject(error)
  }
)

export default request // 导出 request
