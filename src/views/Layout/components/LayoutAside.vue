<template>
  <!-- 侧边栏组件 -->
  <div class="layout-aside">
    <el-menu default-active="1" class="el-menu-vertical-demo" text-color="#666" active-text-color="#2117a3  "
      unique-opened router :collapse="isCollapse">
      <!-- 后台管理项目的 title -->
      <div class="title">
        <img src="../../../assets/images/layout/my-logo.png" alt="">
        <h1 v-show="!isCollapse">&nbsp;&nbsp;&nbsp;&nbsp;Edu-Shuang</h1>
      </div>

      <!-- 权限管理列表 -->
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-lock"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item index="/role">
          <i class="el-icon-setting"></i>
          <span>角色列表</span>
        </el-menu-item>
        <el-menu-item index="/menu">
          <i class="el-icon-setting"></i>
          <span>菜单列表</span>
        </el-menu-item>
        <el-menu-item index="/resource">
          <i class="el-icon-setting"></i>
          <span>资源列表</span>
        </el-menu-item>
      </el-submenu>

      <!-- 课程管理列表 -->
      <el-menu-item index="/course">
        <i class="el-icon-collection"></i>
        <span slot="title">课程管理</span>
      </el-menu-item>

      <!-- 用户管理列表 -->
      <el-menu-item index="/user">
        <i class="el-icon-user"></i>
        <span slot="title">用户管理</span>
      </el-menu-item>

      <!-- 广告管理列表 -->
      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-coin"></i>
          <span slot="title">广告管理</span>
        </template>
        <el-menu-item index="/advert">
          <i class="el-icon-setting"></i>
          <span>广告列表</span>
        </el-menu-item>
        <el-menu-item index="/advert-space">
          <i class="el-icon-setting"></i>
          <span>广告位列表</span>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
// 导入 EventBus 的实例对象
import { bus } from '@/EventBus'

export default {
  name: 'LayoutAside',
  data () {
    return {
      isCollapse: false // 标题名字是否显示
    }
  },
  created () {
    // 给 bus 注册事件，并接收数据
    bus.$on('openAside', () => {
      this.isCollapse = !this.isCollapse
    })
  }
}
</script>

<style lang="scss" scoped>
// 整个侧边栏的样式
.layout-aside {
  height: 100%;

  // 侧边栏标题的样式
  .title {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;

    img {
      width: 30px;
      height: 30px;
    }
  }

  // 侧边栏菜单的样式
  .el-menu {
    height: 100%;
    border-right: 0 none; // 去掉右边框默认的一个间距
  }

  // li 标签 hover 的样式
  .el-menu-item:hover {
    background-color: #e9eef3;
  }
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  min-height: 400px;
}
</style>
