<template>
  <!-- 添加和编辑弹出的对话框 -->
  <div class="create-or-edit">
    <el-form>
      <!-- 资源名称 -->
      <el-form-item label="资源名称" prop="name" label-width="80px">
        <el-input v-model="resourceData.name" clearable></el-input>
      </el-form-item>
      <!-- 资源路径 -->
      <el-form-item label="资源路径" prop="url" label-width="80px">
        <el-input v-model="resourceData.url" clearable></el-input>
      </el-form-item>
      <!-- 资源分类 -->
      <el-form-item label="资源分类" prop="categoryId" label-width="80px">
        <el-select v-model="resourceData.categoryId" clearable placeholder="资源分类">
          <!-- 请求接口进行下拉菜单设置，遍历数据进行下拉列表选项的渲染 -->
          <el-option v-for="item in resourceCategories" :key="item.id" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 资源描述 -->
      <el-form-item label="资源描述" prop="description" label-width="80px">
        <el-input type="textarea" v-model="resourceData.description"></el-input>
      </el-form-item>
      <!-- 操作按钮 -->
      <el-form-item align="center">
        <el-button style="width: 25%" @click="handleCancel">取消</el-button>
        <el-button style="width: 25%" type="primary" @click="handleSave">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入接口
// 1、saveOrderUpdate：保存或更新资源分类的接口
// 2、getResource：获取资源的接口
// 3、getResourceCategories：查询资源分类接口
import { saveOrderUpdate, getResource, getResourceCategories } from '@/services/resource'

export default {
  name: 'CreateOrEdit',
  props: {
    // 父组件传递过来的当前编辑角色的 id
    editRoleId: {
      type: [Number, String]
    }
  },
  data () {
    return {
      // 表单中的角色数据
      resourceData: {
        name: '', // 角色名
        url: '', // 角色 code
        description: '' // 角色描述
      },
      resourceCategories: [] // 存储资源分类下拉列表信息
    }
  },
  created () {
    // 调用加载对应成员的数据
    this.loadresourceData()
    // 加载资源列表
    this.loadResourceCategories()
  },
  methods: {
    // 获取当前资源的数据
    async loadresourceData () {
      const { data } = await getResource(this.editRoleId) // 获取资源信息
      // 请求成功
      if (data.code === '000000') {
        this.resourceData = data.data // 获取当前编辑的资源的数据
      }
    },
    // 加载下拉资源列表
    async loadResourceCategories () {
      const { data } = await getResourceCategories()

      // 判断是否请求成功
      if (data.code === '000000') {
        this.resourceCategories = data.data
      }
    },
    // 更新资源的点击事件
    async handleSave () {
      const { data } = await saveOrderUpdate(this.resourceData) // 更新当前资源
      // 请求发送成功
      if (data.code === '000000') {
        this.$emit('set-success') // 关闭提示框（需要子组件向父组件传递状态）
        this.$message.success('添加成功！') // 保存或更新资源成功提示
        this.resourceData = {} // 清除表单内容
      }
    },
    // 取消保存或更新资源的点击事件
    handleCancel () {
      this.$message.info('取消编辑！') // 保存或更新资源成功提示
      this.$emit('set-cancel') // 关闭提示框（需要子组件向父组件传递状态）
    }
  }
}
</script>

<style lang="scss" scoped></style>
