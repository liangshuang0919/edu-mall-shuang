<template>
  <!-- 更改文章节、课时状态页面组件 -->
  <div class="change-status">
    <el-form>
      <el-form-item label="状态变更为：" label-width="100px">
        <!-- 下拉菜单的区域 -->
        <el-select v-model="value" placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 按钮操作区域 -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="handleSubmit">确 定</el-button>
    </span>
  </div>
</template>

<script>
// 导入接口
// 1、saveOrUpdateSection：新增或更新章节的接口
// 2、saveOrUpdateLesson：新增或更新课时的接口
import { saveOrUpdateSection, saveOrUpdateLesson } from '@/services/course-section'

export default {
  name: 'ChangeStatus',
  props: {
    // 父组件传递过来的当前是更改的章节还是课时状态
    isStatusChapter: {
      type: Boolean,
      required: true
    },
    // 父组件传递过来的当前章节、课时状态的数据
    statusProps: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      // 下拉框的选项
      options: [
        {
          value: 0,
          label: '已隐藏'
        },
        {
          value: 1,
          label: '待更新'
        },
        {
          value: 2,
          label: '已更新'
        }
      ],
      value: this.statusProps.status // 默认选中的 value 值
    }
  },
  methods: {
    // 取消编辑按钮
    handleCancel () {
      // 关闭提示框（需要子组件向父组件传递状态）
      this.$emit('set-cancel')
    },
    // 编辑章节内容信息确认提交按钮
    async handleSubmit () {
      // 如果当前是改变章节状态
      if (this.isStatusChapter) {
        // 将父组件传递过来的值进行浅复制
        const statusData = this.statusProps
        // 改变当前值的状态
        statusData.status = this.value
        // 发送改变章节数据请求
        const { data } = await saveOrUpdateSection(statusData)
        // 如果请求成功
        if (data.code === '000000') {
          this.$emit('set-success') // 告诉父组件请求成功，然后刷新页面获取数据
          this.$message({
            type: 'success',
            message: '更改章节状态成功~',
            duration: 1250
          })
        }
      } else {
        // 如果当前是改变课时状态
        const statusData = {
          id: this.statusProps.id,
          courseId: this.statusProps.courseId,
          sectionId: this.statusProps.sectionId,
          status: this.value
        }
        // 发送改变课时数据请求
        const { data } = await saveOrUpdateLesson(statusData)
        // 如果请求成功
        if (data.code === '000000') {
          this.$emit('set-success') // 告诉父组件请求成功，然后刷新页面获取数据
          this.$message({
            type: 'success',
            message: '更改课时状态成功~',
            duration: 1250
          })
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-select {
  width: 100%;
}
</style>
