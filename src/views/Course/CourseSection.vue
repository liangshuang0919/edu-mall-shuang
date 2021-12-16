<template>
  <!-- 课程内容管理页面组件 -->
  <div class="course-section">
    <el-card v-loading="isLoading">
      <!-- 头部课程相关信息 -->
      <div slot="header" class="course-header">
        <el-button class="el-icon-back" @click="$router.push({ name: 'Course' })">
          返回
        </el-button>
        <!-- 当前课程的名称 -->
        <h3>{{ $route.query.courseName }}</h3>
        <!-- 添加章节 -->
        <el-button class="el-icon-plus" type="primary" @click="handleAdd">
          添加章节
        </el-button>
      </div>

      <!-- 课程内容管理的树型结构 -->
      <!-- draggable 开启拖拽功能；allow-drop 是拖拽功能的函数；node-drop 是拖拽结束后的函数 -->
      <el-tree :data="sectionAndLessonData" :props="defaultProps" draggable :allow-drop="handleAllowDrop"
        @node-drop="handleNodeDrop">
        <!-- 后面的按钮操作 -->
        <!-- node 是当前节点的属性 -->
        <!-- data 是当前节点的数据 -->
        <div class=" inner" slot-scope="{ node, data }">
          <!-- 内容设置 -->
          <!-- 当前节点的标题 -->
          <span>{{ node.label }}</span>
          <!-- 后续按钮结构 -->
          <!-- 如果是章节内容的话 -->
          <span class="actions" v-if="data.sectionName">
            <el-button size="mini" plain @click.stop="handleEdit(data)">编辑</el-button>
            <el-button type="primary" size="mini" @click.stop="handleAdd(data)">添加课时</el-button>
            <el-button type="info" size="mini" plain @click.stop="handleStatus(data)">
              {{ data.status === 0 ? '已隐藏' : data.status === 1 ? '待更新' : '已更新' }}
            </el-button>
          </span>
          <!-- 如果是课时内容的话 -->
          <span class="actions" v-else>
            <el-button size="mini" plain @click.stop="handleEdit(data)">编辑</el-button>
            <el-button type="success" size="mini" @click="$router.push({
              name: 'CourseVideo',
              params: { courseId },
              query:{ lessonId: data.id, courseName: $route.query.courseName, className: node.label }})">
              上传视频
            </el-button>
            <el-button type="info" size="mini" plain @click.stop="handleStatus(data)">
              {{ data.status === 0 ? '已隐藏' : data.status === 1 ? '待更新' : '已更新' }}
            </el-button>
          </span>
        </div>
      </el-tree>

      <!-- 编辑章节、课时页面 -->
      <el-dialog :title="isEditChapter ? '章节信息' : '课时基本信息'" :visible.sync="editVisible" v-if='editVisible'
        width="50%">
        <!-- 添加章节、添加课时页面组件 -->
        <edit-chapter-or-class :is-edit-chapter="isEditChapter" :edit-chapter-props="editChapterProps"
          :edit-class-props="editClassProps" @set-success="handleSuccess" @set-cancel="handleCancel">
        </edit-chapter-or-class>
      </el-dialog>
    </el-card>

    <!-- 添加章节、课时页面 -->
    <el-dialog :title="isAddChapter ? '章节信息' : '课时基本信息'" :visible.sync="addVisible" v-if='addVisible'
      width="50%">
      <!-- 添加章节、添加课时页面组件 -->
      <add-chapter-or-class :is-add-chapter="isAddChapter" :class-props="addClassProps"
        @set-success="handleSuccess" @set-cancel="handleCancel">
      </add-chapter-or-class>
    </el-dialog>

    <!-- 更改状态 -->
    <el-dialog title="提示" :visible.sync="statusVisible" v-if='statusVisible' width="50%">
      <!-- 更改章节、课时状态页面组件 -->
      <change-status :status-props="statusProps" :is-status-chapter="isStatusChapter"
        @set-success="handleSuccess" @set-cancel="handleCancel"></change-status>
    </el-dialog>
  </div>
</template>

<script>
// 导入接口
// 1、getSectionAndLesson：获取章节和课时的接口
// 2、saveOrUpdateSection：新增或更新章节的接口
// 3、saveOrUpdateLesson：新增或更新课时的接口
import { getSectionAndLesson, saveOrUpdateSection, saveOrUpdateLesson } from '@/services/course-section'

// 导入编辑章节、编辑课时弹出的对话框内部的表单组件
import EditChapterOrClass from './components/EditChapterOrClass.vue'
// 导入添加章节、添加课时弹出的对话框内部的表单组件
import AddChapterOrClass from './components/AddChapterOrClass.vue'
// 导入更改章节、课时状态是弹出的对话框的下拉选择组件
import ChangeStatus from './components/ChangeStatus.vue'

export default {
  name: 'CourseSection',
  props: {
    // 课程 ID
    courseId: {
      type: [String, Number],
      required: true
    }
  },
  components: {
    EditChapterOrClass, // 编辑章节、编辑课时组件
    AddChapterOrClass, // 添加章节、添加课时组件
    ChangeStatus // 更改章节、课时状态组件
  },
  data () {
    return {
      sectionAndLessonData: [], // 课程章节和课时内容
      // 树型组件自定义叶子和标签名
      defaultProps: {
        children: 'lessonDTOS', // 子节点的名字
        // 每个子节点的子节点的名字
        label (data) {
          // data 是章节和课时的时候，label 的属性名不同需要分别设置
          // data.sectionName 是章节名
          // data.theme 是课时名
          return data.sectionName || data.theme
        }
      },
      isLoading: false, // 数据加载时，出现等待加载的遮罩层；
      // 下面是添加组件的数据
      isAddChapter: false, // true 为添加章节，false 为添加课时
      addVisible: false, // 控制对话框显示
      addClassProps: {}, // 要传递给子组件的课程的数据
      // 下面是编辑组件的数据
      isEditChapter: false, // true 为编辑章节，false 为编辑课时
      editVisible: false, // 控制对话框显示
      editChapterProps: {}, // 要传递给子组件的编辑章节内容的数据
      editClassProps: {}, // 要传递给子组件的编辑课时内容的数据
      // 下面是更改状态组件的数据
      isStatusChapter: false, // true 为更改章节状态，false 为更改课时状态
      statusVisible: false, // 控制对话框显示
      statusProps: {} // 要传递给子组件的更新状态内容的数据
    }
  },
  created () {
    this.loadSectionAndLesson() // 调用获取章节和课时的函数
  },
  methods: {
    // 获取章节和课程函数
    async loadSectionAndLesson () {
      this.isLoading = true // 更改加载数据状态
      const { data } = await getSectionAndLesson(this.courseId)
      // 请求成功
      if (data.code === '000000') {
        this.isLoading = false // 更改加载数据状态
        this.sectionAndLessonData = data.data // 获取服务器的数据
      }
    },
    // 编辑章节、课时内容按钮函数
    handleEdit (data) {
      // 如果点击的是编辑章节按钮
      this.editVisible = true // 显示弹框
      if (data.sectionName) {
        this.editChapterProps = data // 获取当前章节的数据
        this.isEditChapter = true // 更改为编辑加章节状态
      } else {
        // 如果点击的是编辑课时按钮
        this.editClassProps = data // 获取当前课时的数据
        this.isEditChapter = false // 更改为编辑课时的状态
      }
    },
    // 添加章节、课时按钮函数
    handleAdd (data) {
      this.addVisible = true // 显示弹框
      // 如果点击的是添加课时的按钮
      if (data && data.sectionName) {
        this.addClassProps = data // 获取当前课程的数据
        this.isAddChapter = false // 更改为添加章节状态
      } else {
        // 如果点击的是添加章节的按钮
        this.isAddChapter = true // 更改为添加章节状态
      }
    },
    // 更改章节、课时状态按钮函数
    handleStatus (data) {
      this.statusProps = data // 获取当前章节、课时状态的数据
      this.statusVisible = true // 显示弹框
      // 如果点击的是更改章节状态的按钮
      if (data.sectionName) {
        this.isStatusChapter = true // 更改为更改章节状态
      } else {
        // 如果点击的是更改课时状态的按钮
        this.isStatusChapter = false // 更改为更改课时状态
      }
    },
    // 子组件传递的添加章节成功的回调事件
    handleSuccess () {
      this.addVisible = false // 关闭弹框
      this.editVisible = false // 关闭弹框
      this.statusVisible = false // 关闭弹框
      this.loadSectionAndLesson()
    },
    // 子组件传递的取消按钮的回调事件
    handleCancel () {
      this.addVisible = false // 关闭弹框
      this.editVisible = false // 关闭弹框
      this.statusVisible = false // 关闭弹框
    },
    // 用来进行节点拖拽处理函数
    handleAllowDrop (draggingNode, dropNode, type) {
      // draggingNode 被拖拽的节点；dropNode 拖拽到的目标节点；type 放置节点的位置
      // 1、规则一，只能统计移动（type 不能为 inner）
      // 2、规则二，课时不能拖拽进其他的章节（根据两个节点的 data 中的 sectionId 进行控制）
      return type !== 'inner' && draggingNode.data.sectionId === dropNode.data.sectionId
    },
    // 拖拽节点结束后的处理函数
    async handleNodeDrop (draggingNode, dropNode, type, event) {
      this.isLoading = true // 更改加载数据状态
      // try-catch 抓取成功或失败的处理
      try {
        // draggingNode 被拖拽的节点；dropNode 拖拽到的目标节点；type 放置节点的位置；event 是触发事件
        // 由于有很多章节和课时，需要给每个章节与课时都进行最新的排序顺序和请求
        await Promise.all(dropNode.parent.childNodes.map((item, index) => {
          // 判断当前是章节还是课时，再给对应接口发送请求即可
          if (draggingNode.data.sectionId) {
            // 如果拖拽的节点有 sectionId 的数据，那么就是课时节点
            return saveOrUpdateLesson({
              id: item.data.id,
              orderNum: index // 最新排序的顺序
            })
          } else {
            // 否则就是章节节点
            return saveOrUpdateSection({
              id: item.data.id,
              orderNum: index // 最新排序的顺序
            })
          }
        }))
        // 成功提示框
        this.$message({
          type: 'success',
          message: '数据更新成功~',
          duration: 1000
        })
      } catch (error) {
        // 失败提示框
        this.$message({
          type: 'error',
          message: '数据更新成功~',
          duration: 1000
        })
      }
      this.isLoading = false // 更改加载数据状态
    }
  }
}
</script>

<style lang="scss" scoped>
// 全局样式
.course-section {
  // 头部区域样式
  .course-header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    h3 {
      margin: 0;
      padding: 0;
    }
  }

  // 书型结构的节点样式
  ::v-deep .el-tree-node__content {
    height: 60px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    // 树型结构前面的图标
    .el-tree-node__expand-icon {
      font-size: 20px;
    }

    // 树形结构文字部分
    .el-tree-node__label {
      flex: 1;
      width: 100%;
      height: 100%;
      line-height: 51px;
      font-size: 16px;
    }

    // 在树型结构中自定义的区域样式
    .inner {
      flex: 1;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 5px 10px;
    }
  }
}
</style>
