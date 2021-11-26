import Vue from 'vue' // 导入 vue 实例，挂载上 vue-router
import VueRouter from 'vue-router' // 导入创建 vue-router 的方法
import store from '@/store' // 导入自己写的 vuex 内容

Vue.use(VueRouter) // 将 vue-router 挂载到 vue 实例上

// 导入 vue  组件，进行路有懒加载
const Login = () => import(/* webpackChunkName: 'login' */ '@/views/Login/Login.vue') // 登录页面
const Layout = () => import(/* webpackChunkName: 'Layout' */ '@/views/Layout/Layout.vue') // 页面布局页面
const Home = () => import(/* webpackChunkName: 'Home' */ '@/views/Home/Home.vue') // 首页页面
const Role = () => import(/* webpackChunkName: 'Role' */ '@/views/Role/Role.vue') // ⻆⾊管理页面
// 菜单管理模块
const Menu = () => import(/* webpackChunkName: 'Menu' */ '@/views/Menu/Menu.vue') // 菜单列表主页面
const MenuCreate = () => import(/* webpackChunkName: 'MenuCreate' */ '@/views/Menu/MenuCreate.vue') // 添加菜单页面页面

const Resource = () => import(/* webpackChunkName: 'Resource' */ '@/views/Resource/Resource.vue') // 资源管理页面
const Course = () => import(/* webpackChunkName: 'Course' */ '@/views/Course/Course.vue') // 课程管理页面
const User = () => import(/* webpackChunkName: 'User' */ '@/views/User/User.vue') // ⽤户管理页面
const Advert = () => import(/* webpackChunkName: 'Advert' */ '@/views/Advert/Advert.vue') // 广告管理页面
const AdvertSpace = () => import(/* webpackChunkName: 'AdvertSpace' */ '@/views/AdvertSpace/AdvertSpace.vue') // 广告位管理页面
const ErrorPage = () => import(/* webpackChunkName: 'ErrorPage' */ '@/views/ErrorPage/ErrorPage.vue') // 错误⻚⾯页面

// 定义路由规则
const routes = [
  // 登录页面路由
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Shuang-登录'
    }
  },
  // 页面布局页面
  {
    path: '/',
    component: Layout,
    // 给一级路由设置 requiresAuth 后，自身和所有的子路由均需要进行路由权限认证
    meta: {
      requiresAuth: true // 需要进行登录校验页面访问权限
    },
    children: [
      // 首页页面路由
      {
        path: '',
        name: 'Home',
        component: Home,
        meta: {
          title: 'Shuang-首页'
        }
      },
      // 角色管理页面路由
      {
        path: '/role',
        name: 'Role',
        component: Role,
        meta: {
          title: 'Shuang-角色管理'
        }
      },
      // 菜单列表页面路由
      {
        path: '/menu',
        name: 'Menu',
        component: Menu,
        meta: {
          title: 'Shuang-菜单列表'
        }
      },
      // 添加菜单页面路由
      {
        path: '/menu-create',
        name: 'MenuCreate',
        component: MenuCreate,
        meta: {
          title: 'Shuang-添加菜单'
        }
      },
      // 课程管理页面路由
      {
        path: '/course',
        name: 'Course',
        component: Course,
        meta: {
          title: 'Shuang-课程管理'
        }
      },
      // 菜单管理页面路由
      {
        path: '/resource',
        name: 'Resource',
        component: Resource,
        meta: {
          title: 'Shuang-菜单管理'
        }
      },
      // ⽤户管理页面路由
      {
        path: '/user',
        name: 'User',
        component: User,
        meta: {
          title: 'Shuang-⽤户管理'
        }
      },
      // 广告管理页面路由
      {
        path: '/advert',
        name: 'Advert',
        component: Advert,
        meta: {
          title: 'Shuang-广告管理'
        }
      },
      // 广告位管理页面路由
      {
        path: '/advert-space',
        name: 'AdvertSpace',
        component: AdvertSpace,
        meta: {
          title: 'Shuang-广告位管理'
        }
      }
    ]
  },
  // 错误⻚⾯页面路由
  {
    path: '/*', // 所有其他的页面就跳转到错误页
    name: 'ErrorPage',
    component: ErrorPage,
    meta: {
      title: '404 Not Found'
    }
  }
]

const router = new VueRouter({
  routes // 将路由规则挂在给 router
})

// 全局前置路由守卫
router.beforeEach((to, from, next) => {
  // 进行路由校验页面访问权限
  // to.meta.requiresAuth 表示验证 to（即将到达的路由）路由是否需要进行身份验证
  // requiresAuth 必须和路由中 meta 定义的一致
  // 1、只给一级路由设置 requiresAuth 即可验证所有子路由，然后用如下的方法判定
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // 验证用户是否已经登录，通过获取 vuex 的用户信息进行验证
    if (!store.state.user) {
      // 用户未登录，跳转到登录页
      return next({
        name: 'Login',
        query: {
          // 将本次路由的 fullPath 传递给 Login 页面
          redirect: to.fullPath
        }
      })
    }

    // 用户已经登录，允许访问其他页面
    // 路由发生变化修改页面 title
    if (to.meta.title) {
      document.title = to.meta.title
    }
    next()
  } else {
    next()
  }

  // 2、需要单独对某一个子路由进行验证的话，只需要给子路由设置 requiresAuth 后，可以使用如下判定
  // if (to.meta.requiresAuth) {
  //   console.log('当前页面需要认证！')
  //   // 路由发生变化修改页面 title
  //   if (to.meta.title) {
  //     document.title = to.meta.title
  //   }
  //   next()
  // } else {
  //   console.log('当前页面不需要认证！')
  //   next()
  // }
})

export default router // 导出路由
