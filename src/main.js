import Vue from 'vue' // 引入整个 vue 实例
import App from './App.vue' // 引入主页面文件
import router from './router' // 引入 vue-router
import store from './store' // 引入 vuex

// 配置 ElementUI 插件
// 引入 ElementUI 插件
import ElementUI from 'element-ui'
// 引入 ElementUI 的主题文件
// import 'element-ui/lib/theme-chalk/index.css'
// 引入自定义的 ElementUI 的主题文件
import './styles/index.scss'
// 将 ElementUI 插件注册给 Vue
Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  router, // 注册 vue-router
  store, // 注册 vuex
  render: h => h(App) // 渲染 vue 实例
}).$mount('#app') // 挂载 vue 实例
