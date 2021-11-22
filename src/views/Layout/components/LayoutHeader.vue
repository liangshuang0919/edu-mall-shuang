<template>
  <!-- 头部组件区域 -->
  <div class="layout-header">
    <!-- 左侧面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item><a href="/">活动管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>活动列表</el-breadcrumb-item>
      <el-breadcrumb-item>活动详情</el-breadcrumb-item>
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
        <el-dropdown-item>用户信息</el-dropdown-item>
        <el-dropdown-item divided>退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>

<script>
export default {
  name: 'LayoutHeader',
  data () {
    return {
      circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
    }
  },
  methods: {
    // 用户头像显示失败的回调函数
    errorHandler () {
      return true
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
  justify-content: space-between;

  // 右侧下拉框的样式
  .el-dropdown-link {
    display: flex;
    align-items: center;
  }
}
</style>
