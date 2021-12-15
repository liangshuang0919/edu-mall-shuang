// 阿里云上传接口文件
import request from '@/utils/request' // 导入自定义的 request 请求模块

// 1、获取阿里云图片上传凭证和地址接口
export const aliyunImageUploadAddressAndAuth = () => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunImagUploadAddressAdnAuth.json'
  })
}

// 2、获取阿里云视频上传凭证和地址接口
export const aliyunVideoUploadAddressAndAuth = (params) => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunVideoUploadAddressAdnAuth.json',
    params // 参数包含：视频封面图片地址、视频文件名
  })
}

// 3、阿里云视频转码请求接口
export const aliyunTransCode = (data) => {
  return request({
    method: 'POST',
    url: '/boss/course/upload/aliyunTransCode.json',
    data: data
  })
}

// 4、阿里云转码进度接口
export const aliyunTransCodePercent = (lessonId) => {
  return request({
    method: 'GET',
    url: '/boss/course/upload/aliyunTransCodePercent.json',
    params: {
      lessonId // 课程 ID
    }
  })
}
