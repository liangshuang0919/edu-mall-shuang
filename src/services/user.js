// 用户请求的接口文件
import request from '@/utils/request' // 导入自定义的 request 请求模块

import qs from 'qs' // 导入 qs 模块，用来格式化 url 地址

// 1、用户登录接口
export const login = (data) => {
  return request({
    method: 'POST', // 请求方式
    header: { 'Content-type': 'application/x-www-form-urlencoded' }, // 请求参数的格式
    url: '/front/user/login', // 请求地址
    // post 发送请求的数据的格式应该是 urlencoded 格式的：名=值&名=值
    data: qs.stringify(data) // 将参数格式改成 名=值&名=值 的形式
  })
}

// 2、用户信息接口
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/front/user/getInfo'
  })
}
