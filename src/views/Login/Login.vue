<template>
  <!-- 登录页面组件 -->
  <div class="login bgc">
    <!-- 登录页面标题 -->
    <h2 class="title">客官，请先登录...</h2>

    <el-form ref="form" :rules="formRules" label-position="top" :model="formData" label-width="250px"
      status-icon>
      <!-- 手机号输入框 -->
      <el-form-item label="手机号" prop="phone">
        <el-input v-model=" formData.phone" placeholder="请输入手机号" prefix-icon="el-icon-phone"
          @keyup.enter.native="onSubmit" clearable>
        </el-input>
      </el-form-item>
      <!-- 密码输入框 -->
      <el-form-item label="密码" prop="password">
        <el-input v-model="formData.password" type="password" placeholder="请输入密码" prefix-icon="el-icon-lock"
          @keyup.enter.native="onSubmit" clearable>
        </el-input>
      </el-form-item>

      <el-form-item class="btn">
        <!-- 登录按钮 -->
        <el-button type="primary" plain @click="onSubmit" icon="el-icon-user-solid" :loading="isLoginLoading">
          登录</el-button>
        <!-- 取消登录按钮 -->
        <el-button type="danger" plain @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// 导入封装的接口
// 1、login：用户登录接口
import { login } from '@/services/user'

export default {
  name: 'Login',
  data () {
    return {
      // 存储表单数据
      formData: {
        phone: '18201288771', // 手机号数据
        password: '111111' // 密码数据
      },
      // 用来设置表单校验规则
      // required 表示必填
      // message 表示验证表单后，输入内容有误。显示提示信息
      // trigger 表示触发验证规则的方法，一般就是 blur 失去焦点就进行验证
      // pattern 表示进行正则表达式的验证
      formRules: {
        // 手机号校验规则
        phone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/, message: '请输入正确的手机号', trigger: 'blur' }
        ],
        // 密码校验规则
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 14, message: '密码长度在 6 到 14 个字符', trigger: 'blur' }
          // { pattern: '123456', message: '请输入正确的密码', trigger: 'blur' }
        ]
      },
      // 按钮的等待按钮
      isLoginLoading: false
    }
  },
  methods: {
    // 登录按钮，提交表单方法
    async onSubmit () {
      try {
        // 点击登录按钮，让按钮显示加载的状态
        this.isLoginLoading = true

        // 下面是网络请求的部分
        // 1. 设置校验成功的功能 —— 发送登录请求：
        await this.$refs.form.validate()

        // 2.2 使用自定义的请求方式
        const { data } = await login(this.formData)

        // 3. 响应数据处理
        if (data.state === 1) {
          // 登陆成功时
          // 3.1 显示登陆成功的提示框
          this.$message({
            showClose: true, // 可关闭按钮
            message: '登陆成功！', // 提示框信息
            type: 'success', // 提示框类型
            duration: 1250 // 提示框持续时间
          })

          // 3.3 将用户信息存储到 vuex 中
          this.$store.commit('saveUserInfo', data.content)

          // 3.2 跳转到首页
          // 将 3.2 和 3.3 做了一个位置交换，因为在新的 vue-router 中，设置了权限验证的时候，如果要跳转页面需要判断用户信息是否有值
          if (this.$store.state.user) {
            // 根据可能存在的一个 redirect 数据（即用户在未登录之前是否访问过某个页面），进行跳转设置
            // 功能就是跳转到用户未登录的时候访问的页面；没有访问过的话就跳转到首页
            // $router 是路由对象，存储着 vue-router 的各种属性和方法
            // $route 存储着当前路由的信息数据
            this.$router.push(this.$route.query.redirect || '/')
          }
        } else {
          // 登陆失败
          // 登陆失败的时候，让按钮的等待状态消失
          this.isLoginLoading = false
          // 显示登陆失败的提示框
          this.$message({
            showClose: true, // 可关闭按钮
            message: '用户名或密码错误~', // 提示框信息
            type: 'error', // 提示框类型
            duration: 1250 // 提示框持续时间
          })
          // 清空密码框
          this.formData.password = ''
        }
      } catch (err) {
        // 设置校验失败的功能 —— 提示错误：
        console.log('没有通过校验')
        // 校验失败时，取消登录按钮的等待状态
        this.isLoginLoading = false
      }
    },
    // 取消按钮，进行清空表单内容方法
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss" scoped>
// 设置登录页面组件整体样式
.login {
  display: flex;
  // 设置元素垂直水平居中
  align-items: center;
  justify-content: center;
  height: 100vh;

  // 设置背景样式
  &::before {
    content: '';
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;
    background: transparent url(../../assets/images/login/background-image.jpg) center center no-repeat;
    background-size: cover;
    z-index: -1;
  }

  // 设置标题样式
  .title {
    position: absolute;
    top: 5vh;
    font-size: 32px;
    font-weight: normal;
  }

  // 设置表单样式
  .el-form {
    padding: 15px 25px;
    width: 375px;
    min-width: 375px;
    border-radius: 15px;
    background-color: #ffffff;

    // 设置按钮区域样式
    .btn {
      display: flex;
      justify-content: center;
      margin: 0 auto;

      // 设置按钮样式
      .el-button {
        display: inline-block;
        margin-bottom: 5px;
        width: 182.5px;
      }
    }
  }
}
</style>
