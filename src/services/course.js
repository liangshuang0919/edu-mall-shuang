// 课程管理请求的接口文件
import request from '@/utils/request' // 导入自定义的 request 请求模块

// 1、分页查询课程信息接口
export const getQueryCourses = (data) => {
  return request({
    method: 'POST',
    url: '/boss/course/getQueryCourses',
    data: data
  })
}

// 2、课程上下架接口
export const changeState = (data) => {
  return request({
    method: 'GET',
    url: '/boss/course/changeState',
    params: data
  })
}

// 3、保存或者更新课程信息接口
export const saveOrUpdateCourse = (data) => {
  return request({
    method: 'POST',
    url: '/boss/course/saveOrUpdateCourse',
    data: data
  })
}
