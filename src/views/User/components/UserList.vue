<template>
  <!-- 用户列表页面组件 -->
  <div class="user-list">
    <el-card>
      <!-- 头部表单区域 -->
      <div slot="header">
        <el-form :inline="true" :model="filterParams" ref="form">
          <!-- 手机号 -->
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="filterParams.phone"></el-input>
          </el-form-item>
          <!-- 注册时间 -->
          <el-form-item label="注册时间" prop="rangeDate">
            <el-date-picker v-model="filterParams.rangeDate" type="datetimerange" range-separator="至"
              start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd" />
          </el-form-item>
          <!-- 操作按钮 -->
          <el-form-item>
            <el-button type="primary" @click="handleQuery" :disabled="isLoading">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 主体列表区域 -->
      <el-table :data="users" style="width: 100%" v-loading="isLoading">
        <!-- 用户 ID -->
        <el-table-column prop="id" label="用户ID" width="150" align="center"></el-table-column>
        <!-- 用户头像 -->
        <el-table-column prop="name" label="头像" width="100" align="center">
          <template slot-scope="scope">
            <img width="30px"
              :src="scope.row.portrait || 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
          </template>
        </el-table-column>
        <!-- 用户名 -->
        <el-table-column prop="name" label="用户名" align="center"></el-table-column>
        <!-- 手机号 -->
        <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
        <!-- 用户注册时间 -->
        <el-table-column prop="createTime" label="注册时间" align="center">
          <!-- 用户状态操作（服务端没有开放权限，只能演示） -->
        </el-table-column>
        <!-- 用户状态 -->
        <el-table-column prop="name" label="状态" width="80" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-value="ENABLE" inactive-value="DISABLE"
              active-color="#13ce66" inactive-color="#ff4949" @change="handleForbidUser(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 用户操作 -->
        <el-table-column prop="address" label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="handleSelectRole(scope.row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 设置分配角色的对话框组件 -->
      <el-dialog title="提示" :visible.sync="dialogVisible" width="50%">
        <!-- 下拉菜单的区域 -->
        <el-select v-model="roleIdList" multiple placeholder="请选择">
          <el-option v-for="item in roles" :key="item.value" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
        <!-- 按钮操作区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleAllocRole">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>

    <!-- 底部分页组件 -->
    <div class="block">
      <el-pagination :current-page.sync="filterParams.currentPage" :page-sizes="[10, 15, 20]"
        :page-size="filterParams.pageSize" :total="totalCount" :disabled="isLoading" background
        layout="total, sizes, prev, pager, next, jumper" align="center" @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// 导入接口
// 1、getUserPages：分页查询用户信息的接口
// 2、forbidUser：封禁用户的接口
import { getUserPages, forbidUser } from '@/services/user'
// 3、getRoleAll：获取所有角色的接口
// 4、allocateUserRoles：给用户分配角色的接口
// 5、getUserRole：查询用户角色的接口
import { getAllRoles, allocateUserRoles, getUserRole } from '@/services/role'

export default {
  name: 'UserList',
  data () {
    return {
      // 头部表单过滤数据和底部分页的数据
      filterParams: {
        currentPage: 1, // 当前页数
        pageSize: 10, // 每页数据的个数
        phone: '', // 手机号
        startCreateTime: '', // 注册的开始时间
        endCreateTime: '', // 注册的结束时间
        rangeDate: [] // 注册时间的表单数据
      },
      // 用户列表数据
      users: [],
      dialogVisible: false, // 用于控制分配角色对话框是否显示
      currentRoleId: '', // 当前要进行角色分配的用户 ID
      roles: [], // 分配角色的下拉菜单中的数据
      roleIdList: [], // 下拉菜单中选中菜单的数据
      totalCount: 0, // 服务器用户总个数
      isLoading: false // 数据加载时，出现等待加载的遮罩层；并且控制按钮禁用状态
    }
  },
  methods: {
    // 查询按钮事件
    handleQuery () {
      this.isLoading = true // 改变当前状态为等待状态
      this.filterParams.current = 1 // 下面是非常重要的一点，每次点击筛选的时候，将当前页数变为 1
      this.loadUser() // 筛条件筛选查询的时候，调用一次请求数据的函数
      this.$message.success('查询该用户成功！') // 成功提示框
    },
    // 重置按钮，进行清空表单内容方法
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 加载用户数据函数
    async loadUser () {
      this.isLoading = true // 改变当前状态为等待状态
      const { rangeDate } = this.filterParams // 获取筛选表单中的日期
      // 判断是否设置了开始、截止时间
      if (rangeDate && rangeDate.length) {
        this.filterParams.startCreateTime = rangeDate[0] // 获取开始时间
        this.filterParams.endCreateTime = rangeDate[1] // 获取开始时间
      } else {
        this.filterParams.startCreateTime = '' // 获取开始时间
        this.filterParams.endCreateTime = '' // 获取开始时间
      }

      const { data } = await getUserPages(this.filterParams) // 获取服务器的数据
      // 请求成功
      if (data.code === '000000') {
        this.isLoading = false // 将当前状态改为成功状态
        this.users = data.data.records // 获取所有用户信息
        this.totalCount = data.data.total // 获取所有用户个数
      }
    },
    // 更改用户状态（启用、禁用，后端把这个权限去掉了。没法真实的修改状态）
    async handleForbidUser (user) {
      const { data } = await forbidUser(user.id)
      console.log(data)
    },
    // 分配角色按钮事件
    async handleSelectRole (user) {
      // 获取当前用户已分配角色的信息
      const userRole = await getUserRole(user.id)

      // 如果请求成功
      if (userRole.data.code === '000000') {
        // 获取服务器中选中的下拉菜单数据，显示默认选中
        this.roleIdList = userRole.data.data.map(item => item.id)
      }

      this.currentRoleId = user.id // 获取当前要进行分配角色的用户 ID
      this.dialogVisible = true // 显示分配角色对话框
      const { data } = await getAllRoles() // 请求所有角色列表数据

      // 如果请求成功
      if (data.code === '000000') {
        this.roles = data.data // 获取服务器的角色下拉选框的值
      }
    },
    // 分配角色的确认按钮事件
    async handleAllocRole () {
      // 发送请求
      const { data } = await allocateUserRoles({
        userId: this.currentRoleId,
        roleIdList: this.roleIdList
      })

      // 请求成功
      if (data.code === '000000') {
        this.$message.success('分配角色成功') // 提示框
        this.dialogVisible = false // 关闭对话框
      }
    },
    // 当每页条数发生变化时触发
    handleSizeChange (val) {
      this.filterParams.pageSize = val // 修改每页显示的数据条数
      this.filterParams.currentPage = 1 // 由于修改了每页显示的条数，应当将页数归零
      this.loadUser() // 调用请求按条件分页查询用户数据的方法，让当前页具体的数据显示出来
    },
    // 页号改变触发事件
    handleCurrentChange (val) {
      this.filterParams.currentPage = val // 修改页号
      this.loadUser() // 调用请求按条件分页查询用户数据的方法，让当前页具体的数据显示出来
    }
  },
  created () {
    this.loadUser() // 调用加载用户列表信息函数
  }
}
</script>

<style lang="scss" scoped>
// 分配角色的下拉框的样式
.el-select {
  width: 100%;
}
</style>
