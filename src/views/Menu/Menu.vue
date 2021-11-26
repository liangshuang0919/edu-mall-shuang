<template>
  <!-- 菜单列表页面组件 -->
  <div class="menu">
    <el-card class="box-card">
      <!-- 跳转到添加菜单页面的按钮 -->
      <div slot="header" class="clearfix">
        <el-button @click="$router.push({ name: 'MenuCreate' })">添加菜单</el-button>
      </div>

      <!-- 显示菜单列表区域 -->
      <el-table :data="tableData" style="width: 100%">
        <!-- 列表编号，type="index" 自动添加索引 -->
        <el-table-column prop="date" align="center" label="编号" type="index"></el-table-column>
        <!-- 菜单名称 -->
        <el-table-column prop="name" align="center" label="菜单名称"></el-table-column>
        <!-- 菜单级数 -->
        <el-table-column prop="level" align="center" label="菜单级数"></el-table-column>
        <!-- 前段图标 -->
        <el-table-column prop="icon" align="center" label="前端图标"></el-table-column>
        <!-- 排序 -->
        <el-table-column prop="orderNum" align="center" label="排序"></el-table-column>
        <!-- 操作 -->
        <el-table-column prop="name" align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
// 导入接口
// 1、getAllMenuInfo：获取所有菜单列表数据的接口
// 2、deleteMenu：删除菜单的接口
import { getAllMenuInfo, deleteMenu } from '@/services/menu'

export default {
  name: 'Menu',
  data () {
    return {
      tableData: []
    }
  },
  methods: {
    // 加载菜单列表数据方法
    async loadAllMenuInfo () {
      // 获取所有菜单列表数据
      const { data } = await getAllMenuInfo()

      //  判断是否请求成功
      if (data.code === '000000') {
        this.tableData = data.data
      }
    },
    // 编辑按钮方法
    handleEdit () { },
    // 删除按钮方法
    handleDelete (rowData) {
      // 1、先进行删除确认，防止误点，使用 elementUI 的 MessageBox 组件
      this.$confirm('此操作将永久删除该列表项, 是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        // 2、发送删除菜单请求
        // rowData 是 elementUI 组件用作用域插槽传递过来的当前行的所有数据
        const { data } = await deleteMenu(rowData.id)

        // 判断删除是否成功
        if (data.code === '000000') {
          // 提示删除成功
          this.$message.success('该列表项已删除成功！')
          // 更新数据列表
          this.loadAllMenuInfo()
        }
      }).catch(() => {
        this.$message.info('已取消删除~')
      })
    }
  },
  created () {
    // 调用加载菜单列表数据方法
    this.loadAllMenuInfo()
  }
}
</script>

<style lang="scss" scoped>
.el-card__body {
  background-color: aqua;
}
</style>
