// 后台菜单列表请求的接口文件
import request from '@/utils/request' // 导入自定义的 request 请求模块

// 1、获取编辑菜单信息的接口
export const getEditMenuInfo = (id = -1) => {
  return request({
    method: 'GET',
    // 第一种写请求参数的形式：使用模板字符串
    // url: `/boss/menu/getEditMenuInfo?id=${id}`
    // 第二种写请求参数的形式：通过 params 参数拼接的方式
    url: '/boss/menu/getEditMenuInfo',
    params: {
      id: id
    }
  })
}

// 2、保存或新增菜单接口
export const saveOrUpdateMenu = (data) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data: data
  })
}

// 3、获取所有菜单列表数据接口
export const getAllMenuInfo = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

// 4、删除菜单接口
export const deleteMenu = (id) => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}

// 5、获取所有菜单并按层级展示接口
export const getMenuNodeList = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getMenuNodeList'
  })
}

// 6、给角色分配菜单接口
export const allocateRoleMenus = (data) => {
  return request({
    method: 'POST',
    url: '/boss/menu/allocateRoleMenus',
    data: data
  })
}

// 7、获取当前角色拥有的菜单列表接口
export const getRoleMenus = (roleId) => {
  return request({
    method: 'GET',
    url: `/boss/menu/getRoleMenus?roleId=${roleId}`
  })
}
