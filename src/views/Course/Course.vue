<template>
  <div class="course">
    <course-list></course-list>
  </div>
</template>

<script>
// 导入课程列表组件
import CourseList from './components/CourseList.vue'

export default {
  name: 'Course',
  components: {
    CourseList
  }
}
</script>

<style lang="scss" scoped></style>
