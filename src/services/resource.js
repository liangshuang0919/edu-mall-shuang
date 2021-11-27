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
