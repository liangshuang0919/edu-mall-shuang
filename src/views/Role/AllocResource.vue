<template>
  <!-- 分配资源页面组件 -->
  <div class="alloc-resource">
    <el-card>
      <!-- 顶头部区域 -->
      <div slot="header" class="card-header">
        <!-- 返回按钮 -->
        <el-button class="el-icon-back" @click="$router.push({ name: 'Role' })">
          返回
        </el-button>
        <h2>该页面功能还未完成</h2>
        <!-- 头部区域标题 -->
        <h3>分配资源</h3>
      </div>

      <!-- 分配资源区域 -->
      <el-row v-for="resource in resources" :key="resource.id">
        <el-col :span="24">
          <div class="grid-header bg-row-header">
            <el-checkbox :indeterminate="isIndeterminate[resource.id - 1]" v-model="checkAll[resource.id - 1]"
              @change="handleCheckAllChange(resource.id - 1, checkAll[resource.id - 1])">
              {{ resource.name }}
            </el-checkbox>
          </div>
        </el-col>
        <!-- 分配资源区域的每个资源选框 -->
        <el-col :span="24">
          <div class="grid-main bg-purple">
            <el-checkbox-group v-model="checkedCities" @change="handleCheckedCitiesChange">
              <el-checkbox v-for="city in resource.resourceList" :label="city.name" :key="city.id">
                {{ city.name }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
// 导入接口
// 1、getRoleResources：获取角色拥有的资源列表的接口
// 2、allocateRoleResources：给角色分配资源的接口, allocateRoleResources
import { getRoleResources } from '@/services/resource'

const cityOptions = []
export default {
  name: 'AllocResource',
  data () {
    return {
      resources: [], // 服务器返回的该用户的所有资源列表
      // 下面是分配资源区域全选区域的数据
      isIndeterminate: [], // 控制全选按钮一开始是否勾选上的状态
      checkAll: [], // 控制全选按钮全部选中的状态
      // 下面是分配资源区域选框区域的数据
      checkedCities: [],
      cities: [],
      test: true
    }
  },
  created () {
    // 调用获取角色拥有的资源列表函数
    this.loadRoleResources()
  },
  methods: {
    // 获取角色拥有的资源列表函数
    async loadRoleResources () {
      // 发送请求
      const { data } = await getRoleResources(this.$route.params.roleId)
      console.log(data)
      // 如果请求成功
      if (data.code === '000000') {
        this.resources = data.data // 获取服务器返回的所有资源列表数据
        this.isIndeterminate = this.resources.map(item => item.selected) // 控制全选按钮一开始是否勾选上的状态
        this.checkAll = this.resources.map(items => {
          const resource = items.resourceList

          if (resource) {
            return resource.every(item => item.selected)
          } else {
            return true
          }
        })
      }
    },
    handleCheckAllChange (index, checked) {
      this.checkedCities = checked ? cityOptions : []
      this.isIndeterminate[index] = false
    },
    handleCheckedCitiesChange (value) {
      const checkedCount = value.length
      // this.checkAll = checkedCount === this.cities.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.cities.length
    }
  }
}
</script>

<style lang="scss" scoped>
// 全局样式
.alloc-resource {
  // 卡片区域样式
  .el-card {
    border: 0;
    border-radius: 0;

    // 卡片头部区域样式
    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;

      h3 {
        margin: 0;
        padding: 0;
      }
    }
  }

  // 选框区域样式
  .el-row {
    // 全选按钮区域样式
    .grid-header {
      display: flex;
      justify-content: left;
      align-items: center;
      height: 77px;
      padding-left: 20px;
      border: 1px solid #dcdfe6;
    }

    // 全选区域背景颜色
    .bg-row-header {
      background: #f2f6fc;
    }

    // 选框主体样式
    .grid-main {
      display: flex;
      justify-content: left;
      align-items: center;
      min-height: 77px;
      padding-left: 20px;
      border: 1px solid #dcdfe6;

      // 选框主体中每个盒子的样式
      .el-checkbox {
        width: 255px;
        height: 50px;
        line-height: 50px;
      }
    }
  }
}
</style>
