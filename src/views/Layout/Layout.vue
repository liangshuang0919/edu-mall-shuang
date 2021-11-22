<template>
  <!-- 整个页面显示的布局页面 -->
  <div class="layout">
    <!-- elementUI 容器 -->
    <el-container>
      <!-- 侧边栏区域 -->
      <el-aside width="225px">
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

    }
  }
}
</script>

<style lang="scss" scoped>
// 整体页面容器的样式
.el-container {
  height: 100vh;
  min-width: 980px;

  // 侧边栏的样式
  .el-aside {
    background-color: #d3dce6;
  }

  // 头部的样式
  .el-header {
    background-color: #ffffff;
  }

  // 主题内容的样式
  .el-main {
    background-color: #e9eef3;
  }
}
</style>
