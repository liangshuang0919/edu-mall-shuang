<template>
  <!-- 添加菜单页面组件 -->
  <div class="menu-create">
    <!-- 页面展示布局的子组件，通过 isEdit 传值，展示当前页面名称 -->
    <create-or-edit :is-edit="false"></create-or-edit>
  </div>
</template>

<script>
// 导入显示这个页面整体页面布局的子组件 CreateOrEdit
import CreateOrEdit from './components/CreateOrEdit.vue'

export default {
  name: 'MenuCreate',
  components: {
    CreateOrEdit // 整体页面样式组件
  }
}
</script>

<style lang="scss" scoped></style>
