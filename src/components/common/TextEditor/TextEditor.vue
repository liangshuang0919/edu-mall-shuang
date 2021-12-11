<template>
  <!-- 富文本编辑器组件 -->
  <div class="text-eritor" ref="editor"></div>
</template>

<script>
// 导入 wangEditor 富文本编辑器
import E from 'wangeditor'

// 导入接口
// 1、upLoadCourseImage：上传图片的接口
import { upLoadCourseImage } from '@/services/course'

export default {
  name: 'TextEditor',
  props: {
    // 父组件传递的值
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      editor: null, // 富文本编辑器的内容
      isLoaded: false // 用于标记编辑的数据，是否加载完毕
    }
  },
  methods: {
    // 初始化富文本编辑器
    initEditor () {
      const editor = new E(this.$refs.editor) // 初始化富文本编辑器

      // 必须要在创建富文本编辑器之前，进行事件设置
      // 绑定改变富文本编辑器内容的事件，自定义一个 input 事件，给父组件传值
      editor.config.onchange = (value) => {
        this.$emit('input', value)
      }

      // 配置自定义图片上传的功能
      // resultFiles 是 input 中选中的文件列表
      // insertImgFn 是获取图片 url 后，插入到编辑器的方法
      editor.config.customUploadImg = async (resultFiles, insertImgFn) => {
        // 上传图片的格式为 FormData，实例化 FormData
        const formData = new FormData()
        // 获取到上传的图片文件
        formData.append('file', resultFiles[0])
        // 调用上传图片的接口
        const { data } = await upLoadCourseImage(formData)
        // 如果请求成功
        if (data.code === '000000') {
          // 将上传成功的图片地址，通过 insertImgFn 传给富文本编辑器，进行显示
          insertImgFn(data.data.name)
        }
      }

      editor.create() // 挂载
      editor.txt.html(this.value) // 设置内容
      this.editor = editor // 获取服务器的富文本编辑器内容
    }
  },
  watch: {
    value () {
      if (!this.isLoaded) {
        // 如果当前还没有加载，就获取到加载的新数据，设置给富文本编辑器
        this.editor.txt.html(this.value)
        this.isLoaded = true
      }
    }
  },
  mounted () {
    // 调用初始化富文本编辑器函数
    this.initEditor()
  }
}
</script>

<style lang="scss" scoped></style>
