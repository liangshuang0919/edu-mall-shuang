<template>
  <!-- 课程管理列表页面组件 -->
  <div class="course-list">
    <el-card>
      <div slot="header">
        <span>数据筛选</span>
      </div>

      <!-- 头部表单区域 -->
      <el-form :inline="true" ref="form" label-position="left" :model="filterParams">
        <!-- 课程名称输入框 -->
        <el-form-item label="课程名称：" prop="courseName">
          <el-input v-model="filterParams.courseName"></el-input>
        </el-form-item>
        <!-- 状态下拉列表 -->
        <el-form-item label="状态：" prop="status">
          <el-select v-model="filterParams.status">
            <el-option label="全部" value=""></el-option>
            <el-option label="上架" value="1"></el-option>
            <el-option label="下架" value="0"></el-option>
          </el-select>
        </el-form-item>
        <!-- 按钮操作区域 -->
        <el-form-item>
          <el-button :disabled="isLoading" @click="handleReset('form')">重置</el-button>
          <el-button type="primary" :disabled="isLoading" @click="handleFilter">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!--  -->
    <el-card>
      <div slot="header">
        <span>查询结果：</span>
        <!-- 添加课程按钮 -->
        <el-button class="course-create" type="primary" @click="$router.push({ name: 'CourseCreate'})">
          添加课程
        </el-button>
      </div>

      <!-- 课程展示区域 -->
      <el-table class="course-table" :data="courses" v-loading="isLoading">
        <!-- ID -->
        <el-table-column prop="id" label="ID" width="100" />
        <!-- 课程名称 -->
        <el-table-column prop="courseName" label="课程名称" width="230" />
        <!-- 价格 -->
        <el-table-column prop="price" label="价格" />
        <!-- 排序 -->
        <el-table-column prop="sortNum" label="排序" />
        <!-- 上架状态 -->
        <el-table-column prop="status" label="上架状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" active-color="#13ce66" inactive-color="#ff4949"
              :active-value="1" :inactive-value="0" :disabled="scope.row.isStatusLoading"
              @change="handleChangeState(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column prop="price" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button size="mini"
              @click="$router.push({ name: 'course-edit', params: { courseId: scope.row.id }})">
              编辑
            </el-button>
            <el-button size="mini"
              @click="$router.push({ name: 'course-section', params: { courseId: scope.row.id }})">
              内容管理
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 底部分页区域 -->
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
// 1、getQueryCourses：分页查询课程信息的接口
// 2、changeState：课程上下架的接口
import { getQueryCourses, changeState } from '@/services/course'

export default {
  name: 'CourseList',
  data () {
    return {
      // 筛选功能参数（表单数据）
      filterParams: {
        currentPage: 1, // 当前页数
        pageSize: 10, // 当前页的数据条数
        courseName: '', // 课程名
        status: '' // 课程上下架状态
      },
      courses: [], // 课程信息
      totalCount: 0, // 数据总条数
      isLoading: true // 加载状态
    }
  },
  methods: {
    // 筛选操作
    handleFilter () {
      this.filterParams.currentPage = 1 // 将当前页数置为 1
      this.loadCourses() // 加载课程列表数据
    },
    // 重置操作
    handleReset (formName) {
      this.$refs[formName].resetFields() // 清空表单
    },
    // 加载课程
    async loadCourses () {
      this.isLoading = true // 改变等待状态
      const { data } = await getQueryCourses(this.filterParams) // 获取课程数据
      // 如果请求成功
      if (data.code === '000000') {
        data.data.records.forEach(item => {
          item.isStatusLoading = false // 用于表示当前课程状态更改的状态
        })
        // 保存课程信息
        this.courses = data.data.records // 当前页保存信息
        this.totalCount = data.data.total // 总数据条数
        this.isLoading = false // 改变等待状态
      }
    },
    // 切换上下架状态的事件
    async handleChangeState (course) {
      course.isStatusLoading = true // 点击上下架按钮，禁用当前按钮
      // 发送请求
      const { data } = await changeState({
        courseId: course.id,
        status: course.status
      })
      // 如果处理成功
      if (data.code === '000000') {
        this.$message({
          message: `${course.status === 1 ? '上架' : '下架'}成功`,
          type: 'success',
          duration: 1000
        })
        setTimeout(() => {
          course.isStatusLoading = false // 请求处理成功后，开启按钮的禁用状态
        }, 1000)
      }
    },
    // 当每页条数发生变化时触发
    handleSizeChange (val) {
      this.filterParams.size = val // 修改每页显示的数据条数
      this.filterParams.current = 1 // 由于修改了每页显示的条数，应当将页数归零
      // 调用请求按条件分页查询资源数据的方法，让当前页具体的数据显示出来
      this.loadCourses() // 加载课程列表数据
    },
    // 页号改变触发事件
    handleCurrentChange (val) {
      this.filterParams.currentPage = val // 修改页号
      // 调用请求按条件分页查询资源数据的方法，让当前页具体的数据显示出来
      this.loadCourses()
    }
  },
  created () {
    // 调用加载课程函数
    this.loadCourses()
  }
}
</script>

<style lang="scss" scoped>
// 课程列表页面组件全局样式
.el-card {
  margin-bottom: 20px;

  // 添加课程按钮样式
  .course-create {
    float: right;
    margin-top: -10px;
  }

  // 课程展示区域样式
  .course-table {
    width: 100%;
    margin-bottom: 20px;
  }
}
</style>
