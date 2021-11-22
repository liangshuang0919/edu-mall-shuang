import Vue from 'vue' // 导入 vue 实例，挂载上 vue-router
import VueRouter from 'vue-router' // 导入创建 vue-router 的方法

Vue.use(VueRouter) // 将 vue-router 挂载到 vue 实例上

// 导入 vue  组件，进行路有懒加载
const Login = () => import(/* webpackChunkName: 'login' */ '@/views/Login/Login.vue') // 登录页面
const Layout = () => import(/* webpackChunkName: 'Layout' */ '@/views/Layout/Layout.vue') // 页面布局页面
const Home = () => import(/* webpackChunkName: 'Home' */ '@/views/Home/Home.vue') // 首页页面
const Role = () => import(/* webpackChunkName: 'Role' */ '@/views/Role/Role.vue') // ⻆⾊管理页面
const Menu = () => import(/* webpackChunkName: 'Menu' */ '@/views/Menu/Menu.vue') // 菜单管理页面
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
    component: Login
  },
  // 页面布局页面
  {
    path: '',
    name: 'Layout',
    component: Layout,
    redirect: '/',
    children: [
      // 首页页面路由
      {
        path: '/',
        name: 'Home',
        component: Home,
        meta: {
          title: '首页'
        }
      },
      // 角色管理页面路由
      {
        path: '/role',
        name: 'Role',
        component: Role,
        meta: {
          title: '角色管理'
        }
      },
      // 菜单管理页面路由
      {
        path: '/menu',
        name: 'Menu',
        component: Menu,
        meta: {
          title: '菜单管理'
        }
      },
      // 课程管理页面路由
      {
        path: '/course',
        name: 'Course',
        component: Course,
        meta: {
          title: '课程管理'
        }
      },
      // 菜单管理页面路由
      {
        path: '/resource',
        name: 'Resource',
        component: Resource,
        meta: {
          title: '菜单管理'
        }
      },
      // ⽤户管理页面路由
      {
        path: '/user',
        name: 'User',
        component: User,
        meta: {
          title: '⽤户管理'
        }
      },
      // 广告管理页面路由
      {
        path: '/advert',
        name: 'Advert',
        component: Advert,
        meta: {
          title: '广告管理'
        }
      },
      // 广告位管理页面路由
      {
        path: '/advert-space',
        name: 'AdvertSpace',
        component: AdvertSpace,
        meta: {
          title: '广告位管理'
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

// 路由守卫
router.beforeEach((to, from, next) => {
  // 路由发生变化修改页面 title
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router // 导出路由
