// 角色管理接口文件
import request from '@/utils/request' // 导入自定义的 request 请求模块

// 1、按条件查询角色的接口
export const getRolePages = (data) => {
  return request({
    method: 'POST',
    url: '/boss/role/getRolePages',
    data: data
  })
}

// 2、删除角色的接口
export const deleteRole = (id) => {
  return request({
    method: 'DELETE',
    url: `/boss/role/${id}`
  })
}

// 3、保存或者更新角色的接口
export const saveOrUpdate = (data) => {
  return request({
    method: 'POST',
    url: '/boss/role/saveOrUpdate',
    data: data
  })
}

// 4、获取角色的接口
export const getRoleData = (id) => {
  return request({
    method: 'GET',
    url: `/boss/role/${id}`
  })
}

// 5、获取所有角色接口
export const getAllRoles = () => {
  return request({
    method: 'GET',
    url: '/boss/role/all'
  })
}

// 6、给用户分配角色接口
export const allocateUserRoles = (data) => {
  return request({
    method: 'POST',
    url: '/boss/role/allocateUserRoles',
    data: data
  })
}

// 7、查询用户角色接口
export const getUserRole = (userId) => {
  return request({
    method: 'GET',
    url: `/boss/role/user/${userId}`
  })
}
