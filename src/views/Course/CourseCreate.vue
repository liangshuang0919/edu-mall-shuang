<template>
  <!-- 添加课程页面组件 -->
  <div class="course-create">
    <!-- 添加课程、编辑课程页面组件 -->
    <create-or-edit></create-or-edit>
  </div>
</template>

<script>
// 导入添加课程、编辑课程组件组件
import CreateOrEdit from './components/CreateOrEdit.vue'

export default {
  name: 'CourseCreate',
  components: {
    CreateOrEdit // 添加课程、编辑课程组件
  }
}
</script>

<style lang="scss" scoped></style>
