<template>
  <!-- 整个资源列表组件 -->
  <div class="resource">
    <!-- 资源列表组件 -->
    <resource-list></resource-list>
  </div>
</template>

<script>
// 导入资源列表组件 ResourceList
import ResourceList from './components/ResourceList.vue'

export default {
  name: 'Resource',
  components: {
    ResourceList // 资源列表组件
  }
}
</script>

<style lang="scss" scoped></style>
