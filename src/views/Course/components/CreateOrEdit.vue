<template>
  <!-- 添加课程页面组件 -->
  <div class="create-or-editor">
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
            <el-input v-model="course.courseName" placeholder="请输入课程名称" maxlength="50" show-word-limit clearable>
            </el-input>
          </el-form-item>
          <!-- 课程简介 -->
          <el-form-item label="课程简介" label-width="80px">
            <el-input v-model="course.brief" placeholder="请输入课程简介" maxlength="100" show-word-limit clearable>
            </el-input>
          </el-form-item>
          <!-- 课程概述 -->
          <el-form-item class="course-fields" label="课程概述" label-width="80px">
            <!-- 概述一 -->
            <el-input class="course-field" v-model="course.previewFirstField" placeholder="请输入课程概述 1" maxlength="20"
              show-word-limit clearable></el-input>
            <!-- 概述二 -->
            <el-input class="course-field" v-model="course.previewSecondField" placeholder="请输入课程概述 2" maxlength="20"
              show-word-limit clearable></el-input>
          </el-form-item>
          <!-- 讲师姓名 -->
          <el-form-item label="讲师姓名" label-width="80px">
            <el-input v-model="course.teacherDTO.teacherName" placeholder="请输入讲师姓名" maxlength="50" show-word-limit
              clearable></el-input>
          </el-form-item>
          <!-- 讲师简介 -->
          <el-form-item label="讲师简介" label-width="80px">
            <el-input v-model="course.teacherDTO.description" placeholder="请输入讲师简介" maxlength="50" show-word-limit
              clearable></el-input>
          </el-form-item>
          <!-- 课程排序 -->
          <el-form-item label="课程排序" label-width="80px">
            <el-input-number v-model="course.sortNum" @change="handleChange" :min="1" :max="10" label="描述文字" />
          </el-form-item>
        </div>

        <!-- 课程封面区域 -->
        <div v-show="activeStep === 1">
          <!-- 上传课程封面的组件 -->
          <!-- 上传封面 -->
          <course-image v-model="course.courseListImg" label="课程封面" :limit="2"></course-image>
          <!-- 解锁封面 -->
          <course-image v-model="course.courseImgUrl" label="解锁封面" :limit="2"></course-image>
        </div>

        <!-- 销售信息区域 -->
        <div v-show="activeStep === 2">
          <!-- 售卖价格 -->
          <el-form-item label="售卖价格" label-width="80px">
            <el-input v-model="course.discounts" type="number" :min="0">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <!-- 商品原价 -->
          <el-form-item label="商品原价" label-width="80px">
            <el-input v-model="course.price" type="number" :min="0">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <!-- 销量 -->
          <el-form-item label="销量" label-width="80px">
            <el-input v-model="course.sales" type="number" :min="0">
              <template slot="append">单</template>
            </el-input>
          </el-form-item>
          <!-- 活动标签 -->
          <el-form-item label="活动标签" label-width="80px">
            <el-input v-model="course.discountsTag"></el-input>
          </el-form-item>
        </div>

        <!-- 秒杀活动区域 -->
        <div v-show="activeStep === 3">
          <!-- 限时秒杀开关 -->
          <el-form-item label="限时秒杀开关" label-width="100px">
            <el-switch v-model="course.activityCourse" active-color="#13ce66" inactive-color="#e9eef3"></el-switch>
          </el-form-item>
          <template v-if="course.activityCourse">
            <!-- 开始结束时间 -->
            <el-form-item label="开始结束时间" label-width="100px">
              <el-date-picker class="course-time" v-model="course.activityCourseDTO.beginTime" type="datetime"
                placeholder="选择开始时间">
              </el-date-picker>
              &nbsp;-&nbsp;
              <el-date-picker class="course-time" v-model="course.activityCourseDTO.endTime" type="datetime"
                placeholder="选择结束时间">
              </el-date-picker>
            </el-form-item>
            <!-- 秒杀价格 -->
            <el-form-item label="秒杀价格" label-width="100px">
              <el-input v-model="course.activityCourseDTO.amount" type="number" :min="0">
                <template slot="append">元</template>
              </el-input>
            </el-form-item>
            <!-- 库存 -->
            <el-form-item label="库存" label-width="100px">
              <el-input v-model="course.activityCourseDTO.stock" type="number" :min="0">
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </template>
        </div>

        <!-- 课程详情区域 -->
        <div v-show="activeStep === 4">
          <!-- 课程详情输入区域 -->
          <el-form-item>
            <!-- 富文本编辑器组件 -->
            <text-editor v-model="course.courseDescriptionMarkDown"></text-editor>
          </el-form-item>
          <!-- 控制当前课程是否上架 -->
          <el-form-item label="是否上架该课程">
            <el-switch v-model="course.status" active-color="#13ce66" inactive-color="#e9eef3" :active-value="1"
              :inactiive-value="0">
            </el-switch>
          </el-form-item>
          <!-- 保存按钮 -->
          <el-form-item>
            <el-button class="course-btn" type="primary" round plain @click="handleSave">保存</el-button>
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
// 2、getCourseById：通过课程 Id 获取课程信息的接口
import { saveOrUpdateCourse, getCourseById } from '@/services/course'

// 导入课程封面上传图片组件
import CourseImage from './CourseImage.vue'
// 导入富文本编辑器组件
import TextEditor from '@/components/common/TextEditor/TextEditor.vue'

export default {
  name: 'CreateOrEditor',
  props: {
    // 父组件传递过来的编辑状态
    isEdit: {
      type: Boolean,
      default: false // 默认为 false，不编辑，即为添加课程状态
    },
    // 父组件传递过来的课程 id
    courseId: {
      type: [Number, String]
    }
  },
  components: {
    CourseImage, // 课程封面上传图片组件
    TextEditor // 富文本编辑器组件
  },
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
      // 添加课程的相关信息
      //  - 如果是发送添加课程的请求，那么将 course 数据中与 ID 相关的删除，因为这是编辑课程需要使用到的参数
      course: {
        courseName: '', // 课程名称
        brief: '', // 课程简介
        // 讲师信息
        teacherDTO: {
          teacherName: '', // 讲师姓名
          teacherHeadPicUrl: '',
          position: '',
          description: '' // 讲师描述
        },
        courseDescriptionMarkDown: '<h3>课程详情</h3>', // 课程详情
        price: 0, // 课程商品原价
        discounts: 0, // 课程售卖价格
        priceTag: '',
        discountsTag: '', // 课程活动标签
        isNew: true,
        isNewDes: '',
        courseListImg: '', // 课程列表展示图片地址
        courseImgUrl: '', // 解锁封面地址
        sortNum: 0, // 课程排序
        previewFirstField: '', // 第一条概述
        previewSecondField: '', // 第二条概述
        status: 0, // 是否将当前课程上架的状态：1 为上架，0 为下架
        sales: 0, // 课程销量
        activityCourse: false, // 秒杀活动状态
        activityCourseDTO: {
          beginTime: '', // 秒杀活动开始时间
          endTime: '', // 秒杀活动结束时间
          amount: 0, // 秒杀活动价格
          stock: 0 // 秒杀活动库存
        },
        autoOnlineTime: ''
      }
    }
  },
  methods: {
    // 获取当前课程数据
    async loadCourse () {
      // 发送获取当前课程数据
      const { data } = await getCourseById(this.courseId)
      // 如果请求成功
      if (data.code === '000000') {
        // 判断当前课程是否为开启秒杀的状态
        // 如果没有开启秒杀，需要初始化数据
        if (data.data.activityCourse) {
          data.data.activityCourseDTO = {
            beginTime: '', // 秒杀活动开始时间
            endTime: '', // 秒杀活动结束时间
            amount: 0, // 秒杀活动价格
            stock: 0 // 秒杀活动库存
          }
        }
        this.course = data.data // 获取服务器的当前课程的数据
      }
    },
    // 课程基本信息的课程排序改变事件
    handleChange (value) { },
    // 保存整个课程信息的按钮事件
    async handleSave () {
      // 发送添加课程请求
      const { data } = await saveOrUpdateCourse(this.course)
      // 如果请求成功
      if (data.code === '000000') {
        // 添加课程成功提示框
        this.$message({
          type: 'success',
          message: this.isEdit ? '编辑课程成功~' : '添加课程成功~',
          duration: 1000
        })
        // 路由跳转
        this.$router.push({
          name: 'Course'
        })
      }
    }
  },
  created () {
    // 当前组件编辑完成之后，判断当前是否为编辑状态
    if (this.isEdit) {
      // 如果是编辑状态，就发送请求，调用获取当前课程的信息函数
      this.loadCourse()
    }
  }
}
</script>

<style lang="scss" scoped>
// 添加课程、编辑课程页面全局样式
.create-or-editor {
  // 步骤条样式
  .el-steps {
    margin-top: 20px;

    // 步骤条每一个小区域的样式
    .el-step {
      cursor: pointer;
    }
  }

  // 课程概述输入框样式
  .course-field {
    margin-right: 5px;
    width: 49%;
    min-width: 300px;

    // 第二个概述输入框样式
    &:last-child {
      margin-left: 10px;
      margin-right: 0;
    }
  }

  // 秒杀活动开始结束时间输入框样式
  .course-time {
    margin-right: 4.5px;
    width: 48%;
    min-width: 300px;

    // 第二个概述输入框样式
    &:last-child {
      margin-left: 4.5px;
      margin-right: 0;
    }
  }

  // 页面中按钮的样式
  .course-btn {
    width: 100%;
  }
}
</style>
