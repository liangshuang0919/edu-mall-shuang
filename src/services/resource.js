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

// 3、删除资源接口
export const deleteResource = (id) => {
  return request({
    method: 'DELETE',
    url: `/boss/resource/${id}`
  })
}
