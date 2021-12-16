<template>
  <div class="error-page">
    <el-result icon="error" title="404 Not Found">
      <template slot="extra">
        <el-button type="primary" plain @click="$router.push({ name: 'Home' })">
          返回后台管理系统首页
        </el-button>
      </template>
    </el-result>
  </div>
</template>

<script>
export default {
  name: 'ErrorPage'
}
</script>

<style lang="scss" scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
}
</style>
