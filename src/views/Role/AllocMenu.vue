<template>
  <!-- 给角色分配菜单页面组件 -->
  <div class="alloc-menu">
    这是角色 ID 为：{{ roleId }}
  </div>
</template>

<script>
export default {
  name: 'RoleAllocMenu',
  props: {
    // 路由中的角色 id
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {

    }
  }
}
</script>

<style lang="scss" scoped></style>
