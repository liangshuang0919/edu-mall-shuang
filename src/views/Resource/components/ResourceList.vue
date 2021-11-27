<template>
  <!-- 资源列表区域 -->
  <div class="resource-list">
    <el-card class="box-card">
      <!-- 头部区域，用来展示头部的筛选表单 -->
      <div slot="header" class="clearfix">
        <el-form :inline="true" :model="formPageData" class="demo-form-inline">
          <el-form-item label="审批人">
            <el-input v-model="formPageData.user" placeholder="审批人"></el-input>
          </el-form-item>
          <el-form-item label="活动区域">
            <el-select v-model="formPageData.region" placeholder="活动区域">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onQuery">查询</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 主体区域，用来展示主体内容的展示表格 -->
      <el-table :data="resourceData" border style="width: 100%">
        <!-- 编号 -->
        <el-table-column label="编号" type="index" width="50" align="center"></el-table-column>
        <!-- 资源名称 -->
        <el-table-column prop="name" label="资源名称" align="center"></el-table-column>
        <!-- 资源路径 -->
        <el-table-column prop="url" label="资源路径" align="center"></el-table-column>
        <!-- 资源描述 -->
        <el-table-column prop="description" label="资源描述" align="center"></el-table-column>
        <!-- 添加时间 -->
        <el-table-column label="添加时间" align="center">
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
      <el-pagination :current-page.sync="formPageData.currentPage" :page-sizes="[10, 15, 20]"
        :page-size="formPageData.pageSize" background :total="formPageData.totalCount"
        layout="total, sizes, prev, pager, next, jumper" align="center"
        @size-change="handleSizeChange" @current-change="handleCurrentChange">
      </el-pagination>
    </div>
  </div>
</template>

<script>
// 导入接口
// 1、getResourcePages：按条件分页查询资源接口
import { getResourcePages } from '@/services/resource'

export default {
  name: 'ResourceList',
  data () {
    return {
      // 主体资源列表信息展示区域表格数据
      resourceData: [],
      // 将头部筛选的表单数据，与底部分页要使用到的数据结合在一起，后续数据处理更方便了
      formPageData: {
        currentPage: 1, // 当前显示的页号
        pageSize: 10, // 每一页显示的数据条数
        totalCount: 0
      }
    }
  },
  methods: {
    // 查询按钮事件
    onQuery () { },
    // 异步请求按条件分页查询资源数据
    async loadResource () {
      // 获取服务器传递过来的当前页的资源数据
      const { data } = await getResourcePages({
        current: this.formPageData.currentPage, // 获取某一页的数据
        size: this.formPageData.pageSize // 当前页的数据条数
      })

      // 判断请求是否成功
      if (data.code === '000000') {
        this.resourceData = data.data.records // 获取要在列表中展示的数据
        this.formPageData.totalCount = data.data.total // 服务器中资源列表数据的总数
      }
    },
    // 编辑按钮方法
    handleEdit (rowData) { },
    // 删除按钮方法
    handleDelete (rowData) { },
    // 当每页条数发生变化时触发
    handleSizeChange (val) {
      // 修改每页显示的数据条数
      this.formPageData.pageSize = val

      // 由于修改了每页显示的条数，应当将页数归零
      this.formPageData.currentPage = 1

      // 调用请求按条件分页查询资源数据的方法，让当前页具体的数据显示出来
      this.loadResource()
    },
    // 页号改变触发事件
    handleCurrentChange (val) {
      // 修改页号
      this.formPageData.currentPage = val

      // 调用请求按条件分页查询资源数据的方法，让当前页具体的数据显示出来
      this.loadResource()
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
    // 调用请求按条件分页查询资源数据函数
    this.loadResource()
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
