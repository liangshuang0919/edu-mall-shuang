// 资源管理接口文件
import request from '@/utils/request' // 导入自定义的 request 请求模块

// 1、按条件分页查询资源接口
export const getResourcePages = (data) => {
  return request({
    method: 'POST',
    url: '/boss/resource/getResourcePages',
    data: data
  })
}

// 2、查询资源分类接口
export const getResourceCategories = () => {
  return request({
    methods: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

// 3、获取资源接口
export const getResource = (id) => {
  return request({
    method: 'GET',
    url: `/boss/resource/${id}`
  })
}

// 4、删除资源接口
export const deleteResource = (id) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}

// 5、查询资源分类列表接口
export const getAll = () => {
  return request({
    method: 'GET',
    url: '/boss/resource/category/getAll'
  })
}

// 6、给角色分配资源接口
export const allocateRoleResources = (data) => {
  return request({
    method: 'POST',
    url: '/boss/resource/allocateRoleResources',
    data: data
  })
}

// 7、获取角色拥有的资源列表接口
export const getRoleResources = (roleId) => {
  return request({
    method: 'GET',
    url: `/boss/resource/getRoleResources?roleId=${roleId}`
  })
}

// 8、保存或更新资源分类接口
export const saveOrderUpdate = (data) => {
  return request({
    method: 'POST',
    url: '/boss/resource/saveOrUpdate',
    data: data
  })
}
