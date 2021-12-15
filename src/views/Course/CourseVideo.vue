<template>
  <!-- 上传视频页面组件 -->
  <div class="course-video">
    <el-card>
      <!-- 头部课程相关信息 -->
      <div slot="header">
        <el-button class="el-icon-back" @click="$router.push({ name: 'CourseSection', params: { courseId }})">
          返回
        </el-button>
      </div>

      <!-- 上传表单 -->
      <el-form label-width="80px">
        <!-- 课程 -->
        <el-form-item label="视频上传">
          <el-input :disabled="true"></el-input>
        </el-form-item>
        <!-- 课时 -->
        <el-form-item label="视频上传">
          <el-input :disabled="true"></el-input>
        </el-form-item>
        <!-- 视频上传 -->
        <el-form-item label="视频上传">
          <input type="file" ref="video-file">
        </el-form-item>
        <!-- 封面上传 -->
        <el-form-item label="封面上传">
          <input type="file" ref="image-file">
        </el-form-item>
        <!-- 开始上传按钮 -->
        <el-form-item>
          <el-button type="primary" @click="handleupload">开始上传</el-button>
        </el-form-item>
        <!-- 展示视频上传进度 -->
        <el-form-item>
          <p v-if="uploadPercent !== 0">视频上传进度：{{ uploadPercent }} %</p>
          <p v-if="isUploadSuccess">视频转码进度：{{ isTransCodeSuccess ? '转码完成！' : '正在转码中...' }}</p>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
/* eslint-disable */
// 导入接口
// 1、aliyunImageUploadAddressAndAuth：获取阿里云图片上传凭证和地址的接口
// 2、aliyunVideoUploadAddressAndAuth：获取阿里云视频上传凭证和地址的接口
// 3、aliyunTransCode：阿里云视频转码请求的接口
// 4、aliyunTransCodePercent：阿里云转码进度的接口
import {
  aliyunImageUploadAddressAndAuth,
  aliyunVideoUploadAddressAndAuth,
  aliyunTransCode,
  aliyunTransCodePercent
} from '@/services/aliyun-upload'

export default {
  name: 'CourseVideo',
  props: {
    // 课程 ID
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  data () {
    return {
      uploader: null, // 存储阿里云上传实例
      imageURL: '', // 存储图片上传后的地址，用于视频上传请求（封面图）
      videoId: '', // 存储上传的视频的 ID
      uploadPercent: 0, // 视频上传百分比
      isUploadSuccess: false, // 视频上传完毕状态
      isTransCodeSuccess: false // 视频转码完毕状态
    }
  },
  created () {
    // 调用阿里云上传视频函数
    this.initUploader()
  },
  methods: {
    // 开始上传按钮函数
    handleupload () {
      // 如果想要重新上传的话，需要将之前的数据清空重置
      this.uploadPercent = 0
      this.isUploadSuccess = false
      this.isTransCodeSuccess = false

      const videoFile = this.$refs['video-file'].files[0] // 上传的视频文件
      const imageFile = this.$refs['image-file'].files[0] // 上传的图片文件
      const uploader = this.uploader
      // 将要上传的文件添加进上传列表中
      // 按照业务逻辑应该先上传图片再上传视频，因为视频需要有一个封面
      uploader.addFile(imageFile)
      uploader.addFile(videoFile)
      uploader.startUpload() // 调用开始上传文件
    },
    // 阿里云上传视频的函数
    initUploader () {
      this.uploader = new window.AliyunUpload.Vod({
        userId: '1532835221257260', // userID，必填，只需有值即可。
        region: '', // 上传到视频点播的地域，默认值为'cn-shanghai'，//eu-central-1，ap-southeast-1
        partSize: 1048576, // 分片大小默认1 MB，不能小于100 KB
        parallel: 5, // 并行上传分片个数，默认5
        retryCount: 3, // 网络原因失败时，重新上传次数，默认为3

        // 网络原因失败时，重新上传间隔时间，默认为2秒
        retryDuration: 2,
        // 开始上传图片和视频
        onUploadstarted: async uploadInfo => {
          let uploadAddressAndAuth = null // 用来存储上传的图片数据和上传的视频数据
          // 检测是图片还是视频
          if (uploadInfo.isImage) {
            // 是图片，进行图片处理
            const { data } = await aliyunImageUploadAddressAndAuth()
            // 如果请求成功
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data // 存储图片数据
              this.imageURL = uploadAddressAndAuth.imageURL // 存储上传的图片地址
            }
          } else {
            // 是视频，进行视频处理
            const { data } = await aliyunVideoUploadAddressAndAuth({
              fileName: uploadInfo.file.name, // 视频文件名
              imageUrl: this.imageURL // 视频封面图片地址
            })
            // 如果请求成功
            if (data.code === '000000') {
              uploadAddressAndAuth = data.data // 存储视频数据
              this.videoId = data.data.videoId // 存储视频 ID
            }
          }

          // 设置凭证和地址
          this.uploader.setUploadAuthAndAddress(
            uploadInfo, // 上传的文件信息
            uploadAddressAndAuth.uploadAuth, // 上传的凭证
            uploadAddressAndAuth.uploadAddress, // 上传的地址
            uploadAddressAndAuth.imageId || uploadAddressAndAuth.videoId // 上传的图片或视频的 ID
          )
          // 设置凭证和地址成功，后面就可以开始上传进度的执行了
        },
        // 文件上传成功
        onUploadSucceed: function (uploadInfo) { },
        // 文件上传失败
        onUploadFailed: function (uploadInfo, code, message) { },
        // 文件上传进度，单位：字节
        onUploadProgress: (uploadInfo, totalSize, loadedPercent) => {
          // 判断上传的是图还是视频
          if (!uploadInfo.isImage) {
            // 如果上传的是视频，那么需要显示视频上传的进度
            this.uploadPercent = Math.floor(loadedPercent * 100) // 获取视频上传进度百分比
          }
        },
        // 上传凭证或STS token超时
        onUploadTokenExpired: function (uploadInfo) { },
        // 全部文件上传结束，进行视频转码
        onUploadEnd: async uploadInfo => {
          this.isUploadSuccess = true // 进入这个转码的回调函数时，则表示上传视频已经成功了，修改成功状态
          const lessonId = this.$route.query.lessonId // 课程 ID
          // 发送视频转码请求
          const { data } = await aliyunTransCode({
            lessonId, // 课时 ID
            coverImageUrl: this.imageURL, // 封面图片 ID
            fileId: this.videoId, // 视频 ID
            fileName: this.$refs['video-file'].files[0].name // 视频名
          })
          // 如果转码成功
          if (data.code === '000000') {
            // 轮询转码进度
            const timer = setInterval(async () => {
              // 发送转码进度请求
              const { data } = await aliyunTransCodePercent(lessonId)
              // 如果转码请求成功
              if (data.code === '000000') {
                // 如果转码完毕
                if (data.data === 100) {
                  this.isTransCodeSuccess = true // 转码完毕，更改转码成功状态
                  this.$message({
                    type: 'success',
                    message: '视频转码成功~',
                    duration: 1000
                  })
                  clearInterval(timer) // 清空定时器
                }
              }
            }, 1000)
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
