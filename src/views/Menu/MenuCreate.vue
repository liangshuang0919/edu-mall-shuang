<template>
  <!-- 添加菜单页面组件 -->
  <div class="menu-create">
    <el-card class="box-card">
      <!-- 头部区域 -->
      <div slot="header" class="clearfix">
        <span>添加菜单</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>

      <!-- 表单区域 -->
      <el-form ref="form" :model="formData" :rules="formRules" label-width="80px">
        <!-- 菜单名称（必填） -->
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name"></el-input>
        </el-form-item>

        <!-- 菜单路径 -->
        <el-form-item label="菜单路径" prop="href">
          <el-input v-model="formData.href"></el-input>
        </el-form-item>

        <!-- 下拉菜单列表 -->
        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="formData.parentId" placeholder="请选择上级菜单">
            <!-- 1、下面是不选择上级菜单的，说明当前这个菜单设置为一级菜单 -->
            <el-option label="无上级菜单" :value="-1"></el-option>

            <!-- 2、下面是需要选择上级菜单的，说明当前这个菜单设置为二级菜单 -->
            <!-- 需要将获取的上级菜单数据进行渲染，最后选择某一个的数据，来设置权限管理 -->
            <el-option v-for="item in parentMenuList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- 描述（必填） -->
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description"></el-input>
        </el-form-item>

        <!-- 前端图标（必填） -->
        <el-form-item label="前端图标" prop="icon">
          <el-input v-model="formData.icon"></el-input>
        </el-form-item>

        <!-- 是否显示 -->
        <el-form-item label="是否显示" prop="shown">
          <el-radio-group v-model="formData.shown">
            <!-- label 绑定的数据，会在选择后绑定给 formData.shown -->
            <el-radio :label="true"></el-radio>
            <el-radio :label="false"></el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 排序 -->
        <el-form-item label="排序" prop="orderNum">
          <el-input-number v-model="formData.orderNum" label="描述文字"></el-input-number>
        </el-form-item>

        <!-- 提交、重置按钮 -->
        <el-form-item>
          <el-button type="primary" @click="onSubmit" :loading="isLoginLoading">
            {{ isLoginLoading ? '正在提交' : '提交'}}
          </el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入接口
// 1、getEditMenuInfo：获取编辑菜单页面信息的接口
// 2、saveOrUpdateMenu：保存或新增菜单的接口
import { getEditMenuInfo, saveOrUpdateMenu } from '@/services/menu'

export default {
  name: 'MenuCreate',
  data () {
    return {
      // 表单数据
      formData: {
        parentId: -1,
        name: '',
        href: '',
        icon: '',
        orderNum: 0,
        description: '',
        shown: true
      },
      // 存储上级菜单数据
      parentMenuList: [],
      // 用来设置表单校验规则
      // required 表示必填
      // message 表示验证表单后，输入内容有误。显示提示信息
      // trigger 表示触发验证规则的方法，一般就是 blur 失去焦点就进行验证
      formRules: {
        // 菜单名称校验规则
        name: [
          { required: true, message: '请输入菜单名称', trigger: 'blur' }
        ],
        // 描述校验规则
        description: [
          { required: true, message: '请填写菜单描述', trigger: 'blur' }
        ],
        // 前端图标规则
        icon: [
          { required: true, message: '如输入前端图标', trigger: 'blur' }
        ],
        // 下面的都不是必填选项，而是为重置的时候，可以清空输入的内容
        parentId: [],
        href: [],
        orderNum: [],
        shown: []
      },
      isLoginLoading: false
    }
  },
  methods: {
    // 加载菜单数据
    async loadMenuInfo () {
      // 请求菜单数据（上级菜单数据）
      const { data } = await getEditMenuInfo()

      // 判断请求是否成功
      if (data.code === '000000') {
        // 将上级菜单数据保存，进行数据绑定
        this.parentMenuList = data.data.parentMenuList
      }
    },
    // 提交表单事件
    async onSubmit () {
      // 1、需要先进行表单验证：上面的 formRules 中已经做了
      // 2、发送请求，进行提交表单
      // -2.1 点击提交按钮的时候将提交按钮变为等待状态
      this.isLoginLoading = true

      // -2.2 发送请求
      const { data } = await saveOrUpdateMenu(this.formData)
      // -2.3 判断提交表单是否成功
      if (data.code === '000000') {
        // -2.4 提交成功，将提交按钮变回原样
        this.isLoginLoading = false
        // -2.5 显示提交成功提示框
        this.$message.success('提交成功')
        // -2.6 提交成功后进行路由跳转
        this.$router.push({
          name: 'Menu'
        })
      }
    },
    // 重置按钮，进行清空表单内容方法
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  },
  created () {
    // 加载上级菜单信息
    this.loadMenuInfo()
  }
}
</script>

<style lang="scss" scoped></style>
