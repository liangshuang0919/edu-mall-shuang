<template>
  <!-- 头部组件区域 -->
  <div class="layout-header">
    <!-- 点击展示隐藏侧边栏的按钮 -->
    <button @click.prevent="handleSwitch">
      <i :class="isOpen ? 'el-icon-s-fold' : 'el-icon-s-unfold'"></i>
    </button>

    <!-- 左侧面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item v-if="$route.path !== '/'">
        <router-link :to="$route.path">{{ $route.meta.title.split('-')[1] }}</router-link>
      </el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 右侧用户信息区域 -->
    <el-dropdown>
      <span class="el-dropdown-link">
        <!-- 用户头像 -->
        <el-avatar :size="30" :src="circleUrl" @error="errorHandler">
          <!-- 头像获取失败后，显示下面的图片 -->
          <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png" />
        </el-avatar>

        <!-- 下拉菜单右侧的小图标 -->
        <!-- <i class="el-icon-arrow-down el-icon--right"></i> -->
      </span>

      <!-- 下拉菜单列表内容 -->
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item>{{ userInfo.userName || "个人中心" }}</el-dropdown-item>
        <el-dropdown-item divided @click.native="logout">
          <el-button type="text">退出</el-button>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
// 导入 EventBus 的实例对象
import { bus } from '@/EventBus'

// 导入接口
// getUserInfo 是获取用户信息的接口
import { getUserInfo } from '@/services/user'

export default {
  name: 'LayoutHeader',
  data () {
    return {
      // 用户信息
      userInfo: {},
      // 展开、关闭的图标样式
      isOpen: true
    }
  },
  created () {
    this.loadUserInfo() // 请求用户信息
  },
  computed: {
    // 处理用户的头像，返回的数据有的话就显示用户的头像，没有的话就显示一个默认的头像
    circleUrl () {
      return this.userInfo.circleUrl || 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  methods: {
    handleSwitch () {
      this.isOpen = !this.isOpen // 改变展开、关闭图标样式
      bus.$emit('openAside') // 给事件总线 bus 触发自定义事件，传递数据
    },
    // 用户头像显示失败的回调函数
    errorHandler () {
      return true
    },
    // 使用 async + await 异步加载用户信息
    async loadUserInfo () {
      const { data } = await getUserInfo() // 获取的用户信息

      // 存储用户信息
      this.userInfo = {
        userName: data.content.userName,
        circleUrl: data.content.portrait
      }
    },
    // 用户退出功能
    logout () {
      // 1、用户点击退出的时候，弹出确认框，让用户确认是否继续退出
      this.$confirm('此操作将退出用户登录，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning' // 弹出框提示的类型
      }).then(() => {
        // 点击确认退出的操作
        this.$message({
          type: 'success', // 提示框类型
          message: '退出成功！', // 提示框信息
          duration: 1250 // 提示框持续时间
        })

        // 2、清除 vuex 中 store.state.user 的用户信息
        this.$store.commit('userLogout')

        // 3、跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        // 点击取消退出的操作
        this.$message({
          type: 'info', // 提示框类型
          message: '已取消退出', // 提示框信息
          duration: 1250 // 提示框持续时间
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
// 整体头部组件的样式
.layout-header {
  height: 100%;
  display: flex;
  align-items: center;

  // 展开、关闭菜单按钮
  button {
    flex: 1;
    height: 100%;
    border: 0;
    background-color: #f8f9fb;

    &:hover {
      background-color: #dfe0e1;
      cursor: pointer;
    }

    // 展开、关闭图标
    i {
      font-size: 20px;
    }
  }

  // 中间面包屑导航样式
  .el-breadcrumb {
    flex: 25;
  }

  // 右侧下拉框的样式
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
