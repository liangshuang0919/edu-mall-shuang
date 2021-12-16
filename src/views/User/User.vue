<template>
  <!-- 角色管理页面组件 -->
  <div class="user">
    <!-- 角色管理列表页面组件 -->
    <user-list></user-list>
  </div>
</template>

<script>
// 导入用户列表组件
import UserList from './components/UserList.vue'

export default {
  name: 'User',
  components: {
    UserList // 用户列表组件
  }
}
</script>

<style lang="scss" scoped></style>
