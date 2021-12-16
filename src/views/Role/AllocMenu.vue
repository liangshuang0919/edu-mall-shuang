<template>
  <!-- 给角色分配菜单页面组件 -->
  <div class="alloc-menu">
    <el-card class="box-card">
      <!-- 列表操作按钮 -->
      <div slot="header" class="box-card-header">
        <!-- 返回按钮 -->
        <el-button class="el-icon-back" @click="$router.push({ name: 'Role' })">
          返回
        </el-button>
        <div>
          <el-button @click="onReset">清空</el-button>
          <el-button type="primary" @click="onSave">保存</el-button>
        </div>
      </div>
      <!-- 菜单列表展示 -->
      <br />
      <el-tree ref="menu-tree" node-key="id" :data="menuNodeListData" :props="defaultProps"
        :default-checked-keys="checkedKeys" show-checkbox default-expand-all @node-click="handleNodeClick">
      </el-tree>
    </el-card>
  </div>
</template>

<script>
// 导入接口
// 1、getMenuNodeList：获取所有菜单并按层级展示的接口
// 2、allocateRoleMenus：给角色分配菜单的接口
// 3、getRoleMenus：获取当前角色拥有的菜单列表的接口
import { getMenuNodeList, allocateRoleMenus, getRoleMenus } from '@/services/menu'

export default {
  name: 'AllocMenu',
  props: {
    // 通过路由传参获取的路由中的角色 id
    roleId: {
      type: [Number, String],
      required: true
    }
  },
  data () {
    return {
      menuNodeListData: [], // 树型列表的数据
      // 对树型列表中关键字的名字做一个别处理
      defaultProps: {
        children: 'subMenuList', // 这是子节点数组的别名，要与服务器返回的数据的名字对应起来
        label: 'name' // 这是子节点的别名，要与服务器返回的数据的名字对应起来
      },
      checkedKeys: [] // 默认要被勾选的列表项
    }
  },
  created () {
    // 调用获取所有菜单并按层级展示的函数
    this.loadMenuNodeList()
    // 调用获取当前角色所拥有的菜单选项函数
    this.loadRoleMenus()
  },
  methods: {
    // 点击保存按钮，保存所勾选的数据
    async onSave () {
      // 发送给角色分配菜单的请求，需要传递角色 id 和菜单列表项的 id
      const { data } = await allocateRoleMenus({
        roleId: this.roleId, // 角色 id
        menuIdList: this.$refs['menu-tree'].getCheckedKeys()
      })

      // 发送请求成功
      if (data.code === '000000') {
        this.$message.success('分配菜单成功') // 分配菜单成功提示框
        // 路由跳转
        this.$router.push({
          name: 'Role'
        })
      }
    },
    // 点击清空按钮，清空所勾选的数据
    onReset () {
      this.$refs['menu-tree'].setCheckedKeys([])
    },
    // 获取所有菜单并按层级展示
    async loadMenuNodeList () {
      const { data } = await getMenuNodeList()

      // 数据请求成功
      if (data.code === '000000') {
        this.menuNodeListData = data.data
      }
    },
    // 获取当前角色已经分配了的菜单选项
    async loadRoleMenus () {
      const { data } = await getRoleMenus(this.roleId)

      // 数据请求成功
      if (data.code === '000000') {
        // 调用自己封装的用于数据筛选的方法（筛选出被选中的菜单项的 id）
        this.getCheckedKeys(data.data)
      }
    },
    // 自己封装的用于数据筛选的方法（筛选出被选中的菜单项的 id）
    getCheckedKeys (menus) {
      // 1、需要遍历数据（将所有含有子节点的节点排除，对子节点进行遍历）
      menus.forEach(item => {
        // 2、当前选项未选中
        if (!item.selected) {
          return false
        }
        // 3、当前节点是否存在子节点
        if (item.subMenuList) {
          // 当前节点还有子节点的话，需要对里面的子节点进行递归遍历，看看是否被选中
          return this.getCheckedKeys(item.subMenuList)
        }
        // 4、走到这里的话，表示当前节点被选中，并且没有子节点了（为叶子节点）
        // this.checkedKeys.push(item.id)
        this.checkedKeys = [...this.checkedKeys, item.id]
      })
    },
    // 点击树状列表触发的事件
    handleNodeClick (data) { }
  }
}
</script>

<style lang="scss" scoped>
// 卡片头部区域样式
.box-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
