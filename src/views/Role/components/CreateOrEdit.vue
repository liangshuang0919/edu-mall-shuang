<template>
  <!-- 添加和编辑弹出的对话框 -->
  <div class="create-or-edit">
    <el-form>
      <!-- 角色表单 -->
      <el-form-item label="角色名称" label-width="80px">
        <el-input v-model="roleData.name"></el-input>
      </el-form-item>
      <!-- 角色编码 -->
      <el-form-item label="角色编码" label-width="80px">
        <el-input v-model="roleData.code"></el-input>
      </el-form-item>
      <!-- 角色描述 -->
      <el-form-item label="角色描述" label-width="80px">
        <el-input type="textarea" v-model="roleData.description"></el-input>
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item align="center">
        <el-button style="width: 25%" @click="onCancel">取消</el-button>
        <el-button style="width: 25%" type="primary" @click="onSubmit">{{ isEdit ? '保存' : '创建' }}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入接口
// 1、saveOrUpdate：保存或者更新角色
// 2、getRoleData：获取角色数据
import { saveOrUpdate, getRoleData } from '@/services/role'

export default {
  name: 'CreateOrEdit',
  props: {
    // 父组件传递过来的编辑状态
    isEdit: {
      type: Boolean,
      default: false
    },
    // 父组件传递过来的当前编辑角色的 id
    editRoleId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      // 表单中的角色数据
      roleData: {
        name: '', // 角色名
        code: '', // 角色 code
        description: '' // 角色描述
      }
    }
  },
  methods: {
    // 获取学院的数据
    async loadRoleData () {
      // 获取角色信息
      const { data } = await getRoleData(this.editRoleId)

      // 请求成功
      if (data.code === '000000') {
        // 获取当前编辑的角色的数据
        this.roleData = data.data
      }
    },
    // 保存或者更新角色的点击事件
    async onSubmit () {
      const { data } = await saveOrUpdate(this.roleData)

      // 请求发送成功
      if (data.code === '000000') {
        // 关闭提示框（需要子组件向父组件传递状态）
        this.$emit('set-success')
        // 保存或更新角色成功提示
        this.$message.success('添加成功！')
        // 清除表单内容
        this.roleData = {}
      }
    },
    // 取消保存或更新角色的点击事件
    onCancel () {
      // 关闭提示框（需要子组件向父组件传递状态）
      this.$emit('set-cancel')
      // 除了给父组件中的对话框设置 destroy-on-close，也可以在关闭组件后，再次清空表单数据
      // this.roleData = {}
    }
  },
  created () {
    // 如果当前是编辑状态，那么就调用加载对应成员的数据
    if (this.isEdit) {
      this.loadRoleData()
    }
  }
}
</script>

<style lang="scss" scoped></style>
