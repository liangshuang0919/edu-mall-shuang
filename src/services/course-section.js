// 课程内容管理请求的接口文件
import request from '@/utils/request' // 导入自定义的 request 请求模块

// 1、获取章节和课时接口
export const getSectionAndLesson = (courseId) => {
  return request({
    method: 'GET',
    url: '/boss/course/section/getSectionAndLesson',
    params: {
      courseId
    }
  })
}

// 2、新增或更新章节接口
export const saveOrUpdateSection = (data) => {
  return request({
    method: 'POST',
    url: '/boss/course/section/saveOrUpdateSection',
    data: data
  })
}

// 3、新增或更新课时接口
export const saveOrUpdateLesson = (data) => {
  return request({
    method: 'POST',
    url: '/boss/course/lesson/saveOrUpdate',
    data: data
  })
}
