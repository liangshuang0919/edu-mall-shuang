<template>
  <!-- 课程封面上传图片组件 -->
  <div class="course-image">
    <!-- 课程封面 -->
    <el-form-item :label="label" label-width="80px">
      <!-- 上传文件的进度条组件 -->
      <el-progress v-if="isUploading" :width="178" type="circle" :percentage="percentage" :color="colors"
        :status="percentage === 100 ? 'success' : undefined">
      </el-progress>

      <!-- 上传文件的上传组件 -->
      <!-- http-request 是 elementUI 的上传组件的覆盖默认的上传行为，可以自定义上传的实现的属性 -->
      <el-upload v-else class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
        :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
        :http-request="handleUpload">
        <!-- 上传封面成功后预览的图片 -->
        <img v-if="value" :src="value" class="avatar">
        <!-- 上传封面组件默认的图片 -->
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
  </div>
</template>

<script>
// 导入接口
// 1、upLoadCourseImage：上传图片的接口
import { upLoadCourseImage } from '@/services/course'

export default {
  name: 'CourseImage',
  props: {
    // 父组件中传递过来的值（图片的地址）
    value: {
      type: String
    },
    // 图片标签名
    label: {
      type: String
    },
    // 规定上传图片的大小
    limit: {
      type: Number,
      default: 2
    }
  },
  data () {
    return {
      isUploading: false, // 用于保存当前上传文件的状态（默认是没有上传文件）
      percentage: 0, // 上传文件的进度
      colors: [
        { color: '#f56c6c', percentage: 20 },
        { color: '#e6a23c', percentage: 40 },
        { color: '#6f7ad3', percentage: 60 },
        { color: '#1989fa', percentage: 80 },
        { color: '#5cb87a', percentage: 100 }
      ]
    }
  },
  methods: {
    // 自定义上传图片的处理函数
    // option 为上传的文件的相关信息
    // option.file 为上传的文件信息
    async handleUpload (option) {
      this.isUploading = true // 更改当前上传文件的状态

      // 使用 FormData 对象处理
      const fileData = new FormData() // 实例化 FormData
      // file 是接口文档中的参数名
      // option.file 是要上传的文件的信息
      fileData.append('file', option.file)
      // 发送上传文件请求
      const { data } = await upLoadCourseImage(fileData, event => {
        // event 是文件上传的信息；event.total 是文件上传的总大小；event.loaded 是文件已经上传的大小
        this.percentage = Math.floor(event.loaded / event.total * 100)
      })
      // 如果上传文件成功
      if (data.code === '000000') {
        this.isUploading = false // 更改当前上传文件的状态
        // this.percentage = 0 // 将当前长传的进度归零（避免下次上传文件出现回退的效果）

        // data.data.name 是服务器相应的图片上传成功的一个线上地址
        // 这里需要自定义一个事件，需要将从服务器获取到的图片地址再返回给父组件
        this.$emit('input', data.data.name)
      }
    },
    // 课程封面的上传之前的校验的回事件
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' // 规定上传图片的类型
      const isLtM = file.size / 1024 / 1024 < this.limit // 规定上传图片的大小

      // 如果上传的图片不符合规定的类型
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      // 如果上传的图片不符合规定的大小
      if (!isLtM) {
        this.$message.error('上传头像图片大小不能超过 ' + this.limit + 'MB!')
      }

      return isJPG && isLtM
    },
    // 课程封面的上传封面成功的事件
    handleAvatarSuccess (res, file) {
      // 设置图片预览的地址
      this.imageUrl = URL.createObjectURL(file.raw)
    }
  }
}
</script>

<style lang="scss" scoped>
// 上传封面组件的样式
::v-deep .avatar-uploader {
  // 上传图片的区域样式
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #409eff;
    }
  }

  // 上传图片的图标样式
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  // 上传图片的框的样式
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>
