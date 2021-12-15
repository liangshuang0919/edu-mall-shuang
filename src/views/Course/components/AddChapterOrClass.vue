<template>
  <!-- 添加阶段、添加课时页面组件 -->
  <div class="add-chapter-or-class">
    <!-- 添加阶段的内容 -->
    <el-form :model="chapterData" :rules="rules" v-if="isAddChapter">
      <!-- 课程名称 -->
      <el-form-item label="课程名称" prop="courseName" label-width="80px">
        <el-input v-model="chapterData.courseName" :disabled="true"></el-input>
      </el-form-item>
      <!-- 章节名称 -->
      <el-form-item label="章节名称" prop="sectionName" label-width="80px">
        <el-input v-model="chapterData.sectionName"></el-input>
      </el-form-item>
      <!-- 章节描述 -->
      <el-form-item label="章节描述" label-width="80px">
        <el-input type="textarea" v-model="chapterData.description"></el-input>
      </el-form-item>
      <!-- 章节排序 -->
      <el-form-item label="章节排序" label-width="80px">
        <el-input type="number" v-model="chapterData.orderNum" :min="0">
          <template slot="append">数字控制排序，数字越大越靠后</template>
        </el-input>
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item align="center">
        <el-button style="width: 25%" @click="handleCancel">取消</el-button>
        <el-button style="width: 25%" type="primary" @click="handleChapterSubmit">
          确定
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 添加阶段的内容 -->
    <el-form :model="classData" :rules="rules" v-else>
      <!-- 课程名称 -->
      <el-form-item label="课程名称" prop="courseName" label-width="120px">
        <el-input v-model="chapterData.courseName" :disabled="true"></el-input>
      </el-form-item>
      <!-- 章节名称 -->
      <el-form-item label="章节名称" prop="sectionName" label-width="120px">
        <el-input v-model="classProps.sectionName" :disabled="true"></el-input>
      </el-form-item>
      <!-- 课时名称 -->
      <el-form-item label="课时名称" prop="theme" label-width="120px">
        <el-input v-model="classData.theme"></el-input>
      </el-form-item>
      <!-- 时长 -->
      <el-form-item label="时长" label-width="120px">
        <el-input type="number" v-model="classData.duration" :min="0">
          <template slot="append">分钟</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否开放试听" prop="isFree" label-width="120px">
        <el-switch v-model="classData.isFree"></el-switch>
      </el-form-item>
      <!-- 课程排序 -->
      <el-form-item label="课程排序" label-width="120px">
        <el-input type="number" v-model="classData.orderNum" :min="0">
          <template slot="append">数字控制排序，数字越大越靠后</template>
        </el-input>
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item align="center">
        <el-button style="width: 25%" @click="handleCancel">取消</el-button>
        <el-button style="width: 25%" type="primary" @click="handleClassSubmit">
          确定
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入接口
// 1、saveOrUpdateSection：新增或更新章节的接口
// 2、saveOrUpdateLesson：新增或更新课时的接口
import { saveOrUpdateSection, saveOrUpdateLesson } from '@/services/course-section'

export default {
  name: 'AddChapterOrClass',
  props: {
    // 控制当前是添加阶段还是添加课时
    isAddChapter: {
      type: Boolean,
      required: true
    },
    // 父组件传递过来的课程的数据
    classProps: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 章节数据
      chapterData: {
        courseId: this.$route.params.courseId, // 课程 ID
        courseName: this.$route.query.courseName, // 课程名称
        sectionName: '', // 章节名
        description: '', // 章节描述
        orderNum: 0 // 排序字段
      },
      // 课时数据
      classData: {
        courseId: this.$route.params.courseId, // 课程 ID
        sectionId: this.classProps.id, // 章节 ID
        theme: '', // 课时名称
        duration: 0, // 课时时长
        isFree: false, // 是否免费
        orderNum: 0 // 排序字段
      },
      // 校验规则
      rules: {
        // 课程名称
        courseName: [
          { required: true, message: '', trigger: 'blur' }
        ],
        // 章节名称
        sectionName: [
          { required: true, message: '请输入章节名称', trigger: 'blur' }
        ],
        // 课时名称
        theme: [
          { required: true, message: '请输入课时名称', trigger: 'blur' }
        ],
        // 时长
        duration: [{ required: true }],
        // 是否开放试听
        isFree: [{ required: true }]
      }
    }
  },
  methods: {
    // 取消按钮
    handleCancel () {
      // 关闭提示框（需要子组件向父组件传递状态）
      this.$emit('set-cancel')
    },
    // 提交添加阶段确定按钮
    async handleChapterSubmit () {
      // 发送添加章节请求
      const { data } = await saveOrUpdateSection(this.chapterData)
      // 如果请求成功
      if (data.code === '000000') {
        this.$emit('set-success') // 告诉父组件请求成功，然后刷新页面获取数据
        this.$message({
          type: 'success',
          message: '添加阶段成功~',
          duration: 1250
        })
        this.chapterData = {} // 清空数据
      }
    },
    // 提交添加课时确定按钮
    async handleClassSubmit () {
      // 发送添加课时请求
      const { data } = await saveOrUpdateLesson(this.classData)
      // 如果请求成功
      if (data.code === '000000') {
        this.$emit('set-success') // 告诉父组件请求成功，然后刷新页面获取数据
        this.$message({
          type: 'success',
          message: '添加课时成功~',
          duration: 1250
        })
        this.classData = {} // 清空数据
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
