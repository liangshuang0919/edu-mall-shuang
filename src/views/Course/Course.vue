<template>
  <!-- 课程资源页面组件 -->
  <div class="course">
    <!-- 课程资源列表页面组件 -->
    <course-list></course-list>
  </div>
</template>

<script>
// 导入课程资源列表组件
import CourseList from './components/CourseList.vue'

export default {
  name: 'Course',
  components: {
    CourseList
  }
}
</script>

<style lang="scss" scoped></style>
