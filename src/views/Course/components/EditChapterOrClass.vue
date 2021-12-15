<template>
  <!-- 编辑章节、课时信息 -->
  <div class="edit-stage-or-class">
    <!-- 编辑阶段的内容 -->
    <el-form :model="chapterData" :rules="rules" v-if="isEditChapter">
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
        <el-input v-model="chapterData.description" type="textarea"></el-input>
      </el-form-item>
      <!-- 章节排序 -->
      <el-form-item label="章节排序" label-width="80px">
        <el-input v-model="chapterData.orderNum" type="number" :min="0">
          <template slot="append">数字控制排序，数字越大越靠后</template>
        </el-input>
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item align="center">
        <el-button style="width: 25%" @click="handleCancel">取消</el-button>
        <el-button style="width: 25%" type="primary" @click="handleChapterSubmit">
          保存
        </el-button>
      </el-form-item>
    </el-form>

    <!-- 编辑阶段的内容 -->
    <el-form :model="classData" :rules="rules" v-else>
      <!-- 课程名称 -->
      <el-form-item label="课程名称" prop="courseName" label-width="120px">
        <el-input v-model="chapterData.courseName" :disabled="true"></el-input>
      </el-form-item>
      <!-- 章节名称 -->
      <el-form-item label="章节名称" prop="sectionName" label-width="120px">
        <el-input v-model="chapterData.sectionName" :disabled="true"></el-input>
      </el-form-item>
      <!-- 课时名称 -->
      <el-form-item label="课时名称" prop="theme" label-width="120px">
        <el-input v-model="classData.theme"></el-input>
      </el-form-item>
      <!-- 时长 -->
      <el-form-item label="时长" prop="duration" label-width="120px">
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
  name: 'EditChapterOrClass',
  props: {
    // 父组件传递的控制当前是编辑章节还是编辑课时的变量
    isEditChapter: {
      type: Boolean,
      required: true
    },
    // 父组件传递过来的章节的数据
    editChapterProps: {
      type: Object
    },
    // 父组件传递过来的课时的数据
    editClassProps: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {
      // 章节表单数据
      chapterData: {
        id: this.editChapterProps.id, // 章节 ID
        courseId: this.$route.params.courseId, // 课程 ID
        courseName: this.$route.query.courseName, // 课程名称
        sectionName: this.editChapterProps.sectionName, // 章节名
        description: this.editChapterProps.description, // 章节描述
        orderNum: this.editChapterProps.orderNum // 排序字段
      },
      // 课时数据
      classData: {
        id: this.editClassProps.id, // 课时 ID
        courseId: this.$route.params.courseId, // 课程 ID
        sectionId: this.editClassProps.sectionId, // 章节 ID
        theme: this.editClassProps.theme, // 课时名称
        duration: this.editClassProps.duration, // 课时时长
        isFree: this.editClassProps.isFree, // 是否免费
        orderNum: this.editClassProps.orderNum // 排序字段
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
    // 取消编辑按钮
    handleCancel () {
      // 关闭提示框（需要子组件向父组件传递状态）
      this.$emit('set-cancel')
    },
    // 编辑章节内容信息确认提交按钮
    async handleChapterSubmit () {
      // 发送添加章节请求
      const { data } = await saveOrUpdateSection(this.chapterData)
      // 如果请求成功
      if (data.code === '000000') {
        this.$emit('set-success') // 告诉父组件请求成功，然后刷新页面获取数据
        this.$message({
          type: 'success',
          message: '修改章节成功~',
          duration: 1250
        })
        this.chapterData = {} // 清空数据
      }
    },
    // 编辑课时内容信息确认提交按钮
    async handleClassSubmit () {
      // 发送添加课时请求
      const { data } = await saveOrUpdateLesson(this.classData)
      console.log(data)
      // 如果请求成功
      if (data.code === '000000') {
        this.$emit('set-success') // 告诉父组件请求成功，然后刷新页面获取数据
        this.$message({
          type: 'success',
          message: '修改课时成功~',
          duration: 1250
        })
        this.classData = {} // 清空数据
      }
    }
  }
}
</script>

<style lang="scss" scoped></style>
