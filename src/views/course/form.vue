<template>
  <div>
    <h2 style="text-align:center">发布新课程</h2>
    <el-steps :active="step" finish-status="success" simple style="margin-top: 20px">
      <el-step title="步骤 1" />
      <el-step title="步骤 2" />
      <el-step title="步骤 3" />
    </el-steps>
    <!-- 引入收集课程对应的三个vue组件
      组件名 大写字母改为小写，多个单词之间需要使用-分隔
     -->
    <course-info v-if="step===0"/>
    <course-chapter v-if="step===1"/>
    <course-publish v-if="step===2 || step===3"/>
  </div>
</template>
<script>
// 在vue页面中如何引入vue组件
// 步骤： 1、在当前页面中引入需要使用的vue页面 2、在vue对象中声明要使用的vue组件  3、在vue渲染的范围内就可以将vue组件当做标签使用
import CourseInfo from '@/views/course/components/Info'
import CoursePublish from '@/views/course/components/Publish'
import CourseChapter from '@/views/course/components/Chapter'
export default {
  components: {
    CourseInfo, CoursePublish, CourseChapter
  },
  data() {
    return {
      courseId: '',
      step: 0
    }
  }
}
</script>
