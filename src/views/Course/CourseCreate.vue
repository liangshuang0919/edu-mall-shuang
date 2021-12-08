<template>
  <!-- 添加课程页面组件 -->
  <div class="course-create">
    <el-card>
      <!-- 头部步骤条区域 -->
      <div slot="header">
        <el-steps class="course-step" :active="activeStep" finish-status="success" simple>
          <el-step v-for="item in stepsInfo" :key="item.id" :title="item.title"
            @click.native="activeStep = item.id - 1"></el-step>
        </el-steps>
      </div>

      <!-- 步骤条对应的表单结构 -->
      <el-form v-model="course">
        <!-- 基本信息区域 -->
        <div v-show="activeStep === 0">
          <!-- 课程名称 -->
          <el-form-item label="课程名称" label-width="80px">
            <el-input v-model="course.courseName" placeholder="请输入课程名称" maxlength="50" show-word-limit
              clearable>
            </el-input>
          </el-form-item>
          <!-- 课程简介 -->
          <el-form-item label="课程简介" label-width="80px">
            <el-input v-model="course.brief" placeholder="请输入课程简介" maxlength="100" show-word-limit clearable>
            </el-input>
          </el-form-item>
          <!-- 课程概述 -->
          <el-form-item label="课程概述" label-width="80px">
            <el-input placeholder="请输入课程概述 1" maxlength="20" show-word-limit clearable></el-input>
            <el-input placeholder="请输入课程概述 2" maxlength="20" show-word-limit clearable></el-input>
          </el-form-item>
          <!-- 讲师姓名 -->
          <el-form-item label="讲师姓名" label-width="80px">
            <el-input placeholder="请输入讲师姓名" maxlength="50" show-word-limit clearable></el-input>
          </el-form-item>
          <!-- 讲师简介 -->
          <el-form-item label="讲师简介" label-width="80px">
            <el-input placeholder="请输入讲师简介" maxlength="50" show-word-limit clearable></el-input>
          </el-form-item>
          <!-- 课程排序 -->
          <el-form-item label="课程排序" label-width="80px">
            <el-input-number v-model="courseSort" @change="handleChange" :min="1" :max="10" label="描述文字" />
          </el-form-item>
        </div>

        <!-- 课程封面区域 -->
        <div v-show="activeStep === 1">
          <!-- 课程封面 -->
          <el-form-item label="课程封面">
            <!-- 上传封面的上传组件 -->
            <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <!-- 上传封面成功后展示上传的图片 -->
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <!-- 上传封面组件默认的图片 -->
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>

          <!-- 解锁封面 -->
          <el-form-item label="解锁封面">
            <!-- 上传封面的上传组件 -->
            <el-upload class="avatar-uploader" action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
              <!-- 上传封面成功后展示上传的图片 -->
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <!-- 上传封面组件默认的图片 -->
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>

        <!-- 销售信息区域 -->
        <div v-show="activeStep === 2">
          <el-form-item label="售卖价格" label-width="80px">
            <el-input>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="商品原价" label-width="80px">
            <el-input>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="销量" label-width="80px">
            <el-input>
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <el-form-item label="活动标签" label-width="80px">
            <el-input>
            </el-input>
          </el-form-item>
        </div>

        <!-- 秒杀活动区域 -->
        <div v-show="activeStep === 3">
          <el-form-item label="限时秒杀开关" label-width="100px">
            <el-switch v-model="isSecKill" active-color="#13ce66" inactive-color="#e9eef3">

            </el-switch>
          </el-form-item>
          <template v-if="isSecKill">
            <el-form-item label="开始结束时间" label-width="100px">
              <el-date-picker type="datetime" placeholder="选择开始时间"></el-date-picker>
              &nbsp;-&nbsp;
              <el-date-picker type="datetime" placeholder="选择结束时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="秒杀价格" label-width="100px">
              <el-input>
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <el-form-item label="库存" label-width="100px">
              <el-input>
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>

        <!-- 课程详情区域 -->
        <div v-show="activeStep === 4">
          <!-- 课程详情输入区域 -->
          <el-form-item label="">
            <el-input type="textarea" :rows="10"></el-input>
          </el-form-item>
          <!-- 保存按钮 -->
          <el-form-item>
            <el-button class="course-btn" type="primary" round plain>保存</el-button>
          </el-form-item>
        </div>

        <!-- 下一步按钮 -->
        <el-form-item>
          <el-button class="course-btn" type="primary" round plain v-if="activeStep !== stepsInfo.length - 1"
            @click="activeStep++">
            下一步
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入接口
// 1、saveOrUpdateCourse：保存或者更新课程信息的接口
// import { saveOrUpdateCourse } from '@/services/course'

export default {
  name: 'CourseCreate',
  data () {
    return {
      activeStep: 0, // 步骤条的进度
      // 步骤条相关信息
      stepsInfo: [
        { id: 1, title: '基本信息' },
        { id: 2, title: '课程封面' },
        { id: 3, title: '销售信息' },
        { id: 4, title: '秒杀活动' },
        { id: 5, title: '课程详情' }
      ],
      courseSort: 1, // 基本信息的课程排序的数值
      imageUrl: '', // 课程封面的上传封面图片的本地预览地址
      isSecKill: false, // 秒杀活动的控制秒杀开关的状态
      // 添加课程的相关信息
      course: {
        id: 0,
        courseName: '', // 课程名称
        brief: '',
        teacherDTO: {
          id: 0,
          courseId: 0,
          teacherName: '',
          teacherHeadPicUrl: '',
          position: '',
          description: ''
        },
        courseDescriptionMarkDown: '',
        price: 0,
        discounts: 0,
        priceTag: '',
        discountsTag: '',
        isNew: true,
        isNewDes: '',
        courseListImg: '',
        courseImgUrl: '',
        sortNum: 0,
        previewFirstField: '',
        previewSecondField: '',
        status: 0,
        sales: 0,
        activityCourse: true,
        activityCourseDTO: {
          id: 0,
          courseId: 0,
          beginTime: '',
          endTime: '',
          amount: 0,
          stock: 0
        },
        autoOnlineTime: ''
      }
    }
  },
  methods: {
    // 课程基本信息的课程排序改变事件
    handleChange (value) {
      console.log(value)
    },
    // 课程封面的上传封面成功的事件
    handleAvatarSuccess (res, file) {
      // 设置图片预览的地址
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    // 课程封面的上传之前的校验的事件
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' // 规定上传图片的类型
      const isLt2M = file.size / 1024 / 1024 < 2 // 规定上传图片的大小

      // 如果上传的图片不符合规定的类型
      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      // 如果上传的图片不符合规定的大小
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }

      return isJPG && isLt2M
    }
  }
}
</script>

<style lang="scss" scoped>
// 添加课程页面全局样式
.course-create {
  // 步骤条样式
  .el-steps {
    margin-top: 20px;

    // 步骤条每一个小区域的样式
    .el-step {
      cursor: pointer;
    }
  }

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

  // 页面中按钮的样式
  .course-btn {
    width: 100%;
  }
}
</style>
