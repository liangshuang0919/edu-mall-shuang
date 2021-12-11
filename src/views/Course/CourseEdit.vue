<template>
  <!-- 编辑课程页面组件 -->
  <div class="course-editor">
    <!-- 添加课程、编辑课程页面组件 -->
    <create-or-edit is-edit :course-id="courseId"></create-or-edit>
  </div>
</template>

<script>
// 导入添加课程、编辑课程组件组件
import CreateOrEdit from './components/CreateOrEdit.vue'

export default {
  name: 'CourseEditor',
  props: {
    // 父组件传递的课程 id
    courseId: {
      type: [Number, String],
      required: true
    }
  },
  components: {
    CreateOrEdit // 添加课程、编辑课程组件
  }
}
</script>

<style lang="scss" scoped></style>
