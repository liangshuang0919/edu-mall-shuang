<template>
  <!-- 整个角色列表页面组件 -->
  <div class="role">
    <!-- 角色列表组件 -->
    <role-list></role-list>
  </div>
</template>

<script>
// 导入角色列表组件
import RoleList from './components/RoleList.vue'

export default {
  name: 'Role',
  components: {
    RoleList // 角色列表组件
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped></style>
