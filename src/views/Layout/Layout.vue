<template>
  <!-- 整个页面显示的布局页面 -->
  <div class="layout">
    <!-- elementUI 容器 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside :width="isWidth ? '225px' : '64px'">
        <!-- 侧边栏组件 -->
        <layout-aside></layout-aside>
      </el-aside>

      <!-- 内容区域 -->
      <el-container>
        <!-- 头部区域 -->
        <el-header>
          <!-- 头部组件 -->
          <layout-header></layout-header>
        </el-header>

        <!-- 主要内容区域 -->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// 导入 EventBus 的实例对象
import { bus } from '@/EventBus'

// 引入组件
import LayoutAside from './components/LayoutAside.vue' // 侧边栏组件
import LayoutHeader from './components/LayoutHeader.vue' // 头部组件

export default {
  name: 'Layout',
  components: {
    LayoutAside, // 侧边栏组件
    LayoutHeader // 头部组件
  },
  data () {
    return {
      // 侧边栏的宽度
      isWidth: true
    }
  },
  created () {
    // 给 bus 注册事件，并接收数据
    bus.$on('openAside', () => {
      this.isWidth = !this.isWidth
    })
  }
}
</script>

<style lang="scss" scoped>
// 整体页面容器的样式
.el-container {
  height: 100vh;
  min-width: 975px;

  // 侧边栏的样式
  .el-aside {
    background-color: #e8edf2;
  }

  // 头部的样式
  .el-header {
    background-color: #f8f9fb;
  }

  // 主题内容的样式
  .el-main {
    background-color: #e9eef3;
  }
}
</style>
