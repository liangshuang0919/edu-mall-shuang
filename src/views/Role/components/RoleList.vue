<template>
  <!-- 角色列表组件 -->
  <div class="role-list">
    <el-card class="box-card">
      <!-- 头部查询区域 -->
      <div slot="header" class="clearfix">
        <el-form ref="form" :model="formData">
          <!-- 角色名称 -->
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>

          <!-- 右侧按钮区域 -->
          <el-form-item>
            <el-button type="primary" @click="onQuery" :disabled="isLoading">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 添加角色 -->
      <el-button>添加角色</el-button>

      <!-- 角色列表数据表格 -->
      <el-table :data="rolesData" border style="width: 100%" v-loading="isLoading">
        <!-- 编号 -->
        <el-table-column prop="id" label="编号" align="center" width="100" />
        <!-- 角色名称 -->
        <el-table-column prop="name" label="角色名称" align="center" />
        <!-- 角色描述 -->
        <el-table-column prop="description" label="角色描述" align="center" />
        <!-- 添加时间 -->
        <el-table-column prop="createdTime" label="添加时间" align="center" />
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text">分配菜单</el-button>
              <el-button type="text">分配资源</el-button>
            </div>
            <div>
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// 导入接口
// 1、getRolePages：按条件查询角色
// 2、deleteRole：删除角色
import { getRolePages, deleteRole } from '@/services/role'

export default {
  name: 'RoleList',
  data () {
    return {
      // 表单数据
      formData: {
        name: '' // 角色名称
      },
      // 表格数据
      rolesData: [],
      isLoading: false // 等待数据加载状态
    }
  },
  methods: {
    // 查询用户名按钮事件
    onQuery () {
      console.log('submit!')
    },
    // 重置按钮，进行清空表单内容方法
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 加载角色数据函数
    async loadRoles () {
      // 更改等待数据家在状态
      this.isLoading = true

      // 获取后台返回的所有数据
      const { data } = await getRolePages(this.formData)
      console.log(data)

      if (data.code === '000000') {
        // 请求成功
        this.rolesData = data.data.records // 获取角色数据
        this.isLoading = false // 更改等待加载状态
      }
    },
    // 编辑角色按钮
    handleEdit (rowData) { },
    // 删除角色按钮
    handleDelete (rowData) {
      this.$confirm(`确认删除角色：${rowData.name}`, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteRole(rowData.id) // 发送删除角色请求
          this.$message.success('该角色项成功删除！') // 成功提示框
          this.loadRoles() // 加载数据
        })
        .catch(err => {
          if (err && err.response) {
            // 删除请求失败
            this.$message.error('删除失败，请重试！')
          } else {
            // 取消角色删除
            this.$message.info('已取消删除操作~')
          }
        })
    }
  },
  created () {
    // 调用获取角色数据的函数
    this.loadRoles()
  }
}
</script>

<style lang="scss" scoped></style>
