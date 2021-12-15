<template>
  <!-- 角色列表组件 -->
  <div class="role-list">
    <el-card class="box-card">
      <!-- 头部查询区域 -->
      <div slot="header" class="clearfix">
        <el-form ref="form" :inline="true" :model="formData" class="demo-form-inline">
          <!-- 角色名称 -->
          <el-form-item label="角色名称：" prop="name">
            <el-input v-model="formData.name" width="500"></el-input>
          </el-form-item>

          <!-- 右侧按钮区域 -->
          <el-form-item>
            <el-button type="primary" @click="onQuery" :disabled="isLoading">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 添加角色 -->
      <el-button class="addRole" type="primary" plain @click="handleAddRole">创建角色</el-button>

      <!-- 角色列表数据表格 -->
      <el-table :data="rolesData" border style="width: 100%" v-loading="isLoading">
        <!-- 编号 -->
        <el-table-column prop="id" label="编号" align="center" width="100" />
        <!-- 角色名称 -->
        <el-table-column prop="name" label="角色名称" align="center" />
        <!-- 角色描述 -->
        <el-table-column prop="description" label="角色描述" align="center" />
        <!-- 添加时间 -->
        <el-table-column prop="createdTime" label="添加时间" align="center">
          <!-- 添加时间的数据，后台传递过来的需要修改，在 elementUI 中需要用作用域插槽进行数据的修改 -->
          <template slot-scope="scope">
            <!-- 使用过滤器对数据进行修改 -->
            <span>{{ scope.row.createdTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <div>
              <el-button type="text"
                @click="$router.push({ name: 'AllocMenu', params: { roleId: scope.row.id } })">
                分配菜单
              </el-button>
              <el-button type="text"
                @click="$router.push({ name: 'AllocResource', params: { roleId: scope.row.id } })">
                分配资源
              </el-button>
            </div>
            <div>
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <!-- 添加角色和修改角色弹出的对话框 -->
      <!-- destroy-on-close 这个是 elementUI 自己的属性，当关闭对话框的时候，将该组件销毁 -->
      <!-- 因为如果对话框中的表单有内容的话，点击取消再次打开后还会保留上一次的数据，所以需要销毁 -->
      <el-dialog :title="isEdit ? '编辑角色' : '添加角色'" :visible.sync="dialogVisible" v-if='dialogVisible'
        width="35%">
        <create-or-edit :edit-role-id="editRoleId" :is-edit="isEdit" @set-success="handleSuccess"
          @set-cancel="handleCancel" />
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
// 导入接口
// 1、getRolePages：按条件查询角色
// 2、deleteRole：删除角色
import { getRolePages, deleteRole } from '@/services/role'

// 导入创建角色、编辑角色弹出的对话框内部的表单组件
import CreateOrEdit from './CreateOrEdit.vue'

export default {
  name: 'RoleList',
  components: {
    CreateOrEdit // 创建角色、编辑角色弹出的对话框内部的表单组件
  },
  data () {
    return {
      // 表单数据
      formData: {
        name: '' // 角色名称
      },
      // 表格数据
      rolesData: [],
      isLoading: false, // 等待数据加载状态
      dialogVisible: false, // 控制对话框显示
      isEdit: false, // 控制对话框的功能状态（false 为保存新角色的状态；true 为编辑旧角色的状态）
      editRoleId: '' // 保存当前正在编辑的角色的 id
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
    // 点击创建新角色按钮触发
    handleAddRole () {
      // 改变编辑状态，当前为创建角色状态
      this.isEdit = false
      // 显示对话框
      this.dialogVisible = true
    },
    // 子组件保存或更新角色成功，告诉父组件的自定义事件
    handleSuccess () {
      // 关闭输入表单
      this.dialogVisible = false
      // 刷新页面数据
      this.loadRoles()
    },
    // 子组件取消编辑，告诉父组件的自定义事件
    handleCancel () {
      // 关闭提示框
      this.dialogVisible = false
    },
    // 加载角色数据函数
    async loadRoles () {
      // 更改等待数据家在状态
      this.isLoading = true

      // 获取后台返回的所有数据
      const { data } = await getRolePages(this.formData)

      if (data.code === '000000') {
        // 请求成功
        this.rolesData = data.data.records // 获取角色数据
        this.isLoading = false // 更改等待加载状态
      }
    },
    // 编辑角色按钮
    handleEdit (rowData) {
      // 改变编辑状态，当前为编辑角色状态
      this.isEdit = true
      // 显示对话框
      this.dialogVisible = true
      // 获取当前正在编辑的角色的 id
      this.editRoleId = rowData.id
    },
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
  filters: {
    // 日期过滤器
    dateFormat (date) {
      // 格式服务器传递过来的日期
      date = new Date(date)

      return `
        ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}
        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  },
  created () {
    // 调用获取角色数据的函数
    this.loadRoles()
  }
}
</script>

<style lang="scss" scope>
// 去除表格的内边距
.el-card__body {
  margin: 0;
  padding: 0;
  clear: both;

  // 添加角色按钮样式
  .addRole {
    margin: 20px;
    margin-left: calc(100% - 150px);
  }

  // 去除表格外的边框
  .el-table--border {
    border-bottom: 0;
    border-left: 0;
    border-right: 0;
  }
}
</style>
