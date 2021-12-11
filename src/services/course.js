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

// 4、上传图片接口
export const upLoadCourseImage = (data, onUploadProgress) => {
  // 注意该接口的请求数据类型是 multipart/form-data
  // data 应该为 FormData 类型
  return request({
    method: 'POST',
    url: '/boss/course/upload',
    data: data,
    // onUploadProgress 是 axios 自带的一个检测上传文件进度的回调函数
    onUploadProgress
  })
}

// 5、通过课程 Id 获取课程信息接口
export const getCourseById = (courseId) => {
  return request({
    method: 'GET',
    url: `/boss/course/getCourseById?courseId=${courseId}`
  })
}
