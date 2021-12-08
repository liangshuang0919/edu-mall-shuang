<template>
  <!-- 资源列表区域 -->
  <div class="resource-list">
    <el-card class="box-card">
      <!-- 头部区域，用来展示头部的筛选表单 -->
      <div slot="header" class="clearfix">
        <el-form ref="form" :inline="true" :model="filterParams" class="demo-form-inline">
          <!-- 资源名称 -->
          <el-form-item label="资源名称" prop="name">
            <el-input v-model="filterParams.name" placeholder="资源名称" clearable></el-input>
          </el-form-item>
          <!-- 资源路径 -->
          <el-form-item label="资源路径" prop="url">
            <el-input v-model="filterParams.url" placeholder="资源路径" clearable></el-input>
          </el-form-item>
          <!-- 资源分类 -->
          <el-form-item label="资源分类" prop="categoryId">
            <el-select v-model="filterParams.categoryId" clearable placeholder="资源分类">
              <!-- 请求接口进行下拉菜单设置，遍历数据进行下拉列表选项的渲染 -->
              <el-option v-for="item in resourceCategories" :key="item.id" :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>

          <!-- 右侧按钮 -->
          <el-form-item class="btnArea">
            <el-button type="primary" @click="handleQuery" :disabled="isLoading">查询</el-button>
            <el-button @click="resetForm('form')">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 主体区域，用来展示主体内容的展示表格 -->
      <el-table :data="resourceData" border style="width: 100%" v-loading="isLoading">
        <!-- 编号 -->
        <el-table-column label="编号" type="index" width="50" align="center"></el-table-column>
        <!-- 资源名称 -->
        <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
        <!-- 资源路径 -->
        <el-table-column prop="url" label="资源路径" align="center"></el-table-column>
        <!-- 资源描述 -->
        <el-table-column prop="description" label="资源描述" align="center"></el-table-column>
        <!-- 添加时间 -->
        <el-table-column prop="createdTime" label="添加时间" align="center">
          <!-- 添加时间的数据，后台传递过来的需要修改，在 elementUI 中需要用作用域插槽进行数据的修改 -->
          <template slot-scope="scope">
            <!-- 使用过滤器对数据进行修改 -->
            <span>{{ scope.row.createdTime | dateFormat }}</span>
          </template>
        </el-table-column>
        <!-- 资源操作 -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 底部分页区域 -->
    <div class="block">
      <el-pagination :current-page.sync="filterParams.current" :page-sizes="[10, 15, 20]"
        :page-size="filterParams.size" :total="totalCount" :disabled="isLoading" background
        layout="total, sizes, prev, pager, next, jumper" align="center" @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </div>

    <!-- 添加角色和修改角色弹出的对话框 -->
    <!-- destroy-on-close 这个是 elementUI 自己的属性，当关闭对话框的时候，将该组件销毁 -->
    <!-- 因为如果对话框中的表单有内容的话，点击取消再次打开后还会保留上一次的数据，所以需要销毁 -->
    <el-dialog title="编辑资源" :visible.sync="dialogVisible" v-if='dialogVisible' width="35%">
      <create-or-edit :edit-role-id="editRoleId" @set-success="handleSuccess" @set-cancel="handleCancel" />
    </el-dialog>
  </div>
</template>

<script>
// 导入接口
// 1、getResourcePages：按条件分页查询资源接口
// 2、getResourceCategories：查询资源分类接口
// 3、deleteResource：删除资源接口
import { getResourcePages, getResourceCategories, deleteResource } from '@/services/resource'

// 导入编辑资源弹出的对话框内部的表单组件
import CreateOrEdit from './CreateOrEdit.vue'

export default {
  name: 'ResourceList',
  components: {
    CreateOrEdit // 编辑资源信息组件
  },
  data () {
    return {
      // 主体资源列表信息展示区域表格数据
      resourceData: [],
      // 将头部筛选的表单数据，与底部分页要使用到的数据结合在一起，后续数据处理更方便了
      filterParams: {
        name: '', // 资源名称
        url: '', // 资源路径
        categoryId: '', // 资源分类 id
        current: 1, // 当前显示的页号
        size: 10 // 每一页显示的数据条数
      },
      // 数据总数
      totalCount: 0,
      resourceCategories: [], // 存储资源分类下拉列表信息
      dialogVisible: false, // 控制对话框显示
      editRoleId: '', // 保存当前正在编辑的角色的 id
      isLoading: false // 数据加载时，出现等待加载的遮罩层；并且控制按钮禁用状态
    }
  },
  methods: {
    // 加载下拉资源列表
    async loadResourceCategories () {
      const { data } = await getResourceCategories()

      // 判断是否请求成功
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    // 查询按钮事件
    handleQuery () {
      // 下面是非常重要的一点，每次点击筛选的时候，将当前页数变为 1
      this.filterParams.current = 1
      // 筛条件筛选查询的时候，调用一次请求数据的函数
      this.loadResource()
    },
    // 重置按钮，进行清空表单内容方法
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 异步请求按条件分页查询资源数据
    async loadResource () {
      // 加载数据的时候，开启加载状态
      this.isLoading = true
      // 获取服务器传递过来的当前页的资源数据
      const { data } = await getResourcePages(this.filterParams)

      // 判断请求是否成功
      if (data.code === '000000') {
        this.isLoading = false // 取消加载状态
        this.resourceData = data.data.records // 获取要在列表中展示的数据
        this.totalCount = data.data.total // 服务器中资源列表数据的总数
      }
    },
    // 编辑按钮方法
    handleEdit (rowData) {
      this.editRoleId = rowData.id // 获取当前编辑的资源 id
      this.dialogVisible = true // 显示编辑资源信息组件
    },
    // 子组件保存或更新角色成功，告诉父组件的自定义事件
    handleSuccess () {
      this.dialogVisible = false // 关闭编辑表单
      this.loadResource() // 刷新页面数据
    },
    // 子组件取消编辑，告诉父组件的自定义事件
    handleCancel () {
      this.dialogVisible = false // 关闭提示框
    },
    // 删除按钮方法
    handleDelete (rowData) {
      this.$confirm(`确认删除该资源：${rowData.name}`, '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          await deleteResource(rowData.id) // 发送删除角色请求
          this.$message.success('该资源项已成功删除！') // 成功提示框
          this.loadResource() // 加载数据
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
    },
    // 当每页条数发生变化时触发
    handleSizeChange (val) {
      this.filterParams.size = val // 修改每页显示的数据条数
      this.filterParams.current = 1 // 由于修改了每页显示的条数，应当将页数归零

      // 调用请求按条件分页查询资源数据的方法，让当前页具体的数据显示出来
      this.loadResource()
    },
    // 页号改变触发事件
    handleCurrentChange (val) {
      this.filterParams.current = val // 修改页号

      // 调用请求按条件分页查询资源数据的方法，让当前页具体的数据显示出来
      this.loadResource()
    }
  },
  filters: {
    // 日期过滤器
    dateFormat (date) {
      date = new Date(date) // 格式服务器传递过来的日期
      return `
        ${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}
        ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}
      `
    }
  },
  created () {
    // 调用请求按条件分页查询资源数据函数
    this.loadResource()
    // 加载资源列表
    this.loadResourceCategories()
  }
}
</script>

<style lang="scss" scope>
// 去除表格的内边距
.el-card__body {
  padding: 0;

  // 去除表格外的边框
  .el-table--border {
    border: 0;
  }
}

// 底部分页区域样式
.block {
  margin-top: 1rem;
}
</style>
