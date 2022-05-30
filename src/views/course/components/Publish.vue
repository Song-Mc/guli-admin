<template>
  <div>
    <!--课程预览-->
    <div class="ccInfo" style="padding:10px">
      <img :src="coursePublish.cover">
      <div class="main">
        <h2>{{ coursePublish.title }}</h2>
        <p class="gray"><span>共{{ coursePublish.lessonNum }}课时</span></p>
        <p><span>所属分类：{{ coursePublish.subjectParentTitle }} — {{ coursePublish.subjectTitle }}</span></p>
        <p>课程讲师：{{ coursePublish.teacherName }}</p>
        <h3 class="red">￥{{ coursePublish.price }}</h3>
      </div>
    </div>
    <div style="text-align:center">
      <el-button :disabled="preFlag" type="primary" @click="pre">上一步</el-button>
      <el-button :disabled="nextFlag" type="primary" @click="publish">发布课程</el-button>
    </div>
  </div>
</template>
<script>
import courseApi from '@/api/course'
export default {
  /**
   * 在vue子组件中查找父组件：使用this.$parent
   * 在vue父组件中查找子组件：使用this.$children并不方便
   *                        一般采用ref，可以使用ref在父组件中给子组件命名：this.$refs.子组件名称
   */
  data() {
    return {
      coursePublish: {},
      preFlag: false,
      nextFlag: false
    }
  },
  created() {
    this.getCoursePublish()
  },
  methods: {
    // 查询回显课程发布信息
    getCoursePublish() {
      courseApi.getCoursePublish(this.$parent.courseId).then(response => {
        this.coursePublish = response.data.item
      })
    },

    pre() {
      this.preFlag = true
      this.$parent.step = 1
    },
    publish() {
      this.nextFlag = true
      courseApi.publishCourse(this.$parent.courseId).then(response => {
        this.$message.success('课程发布成功')
        this.$parent.step = 3
        // 跳转到课程列表页面
      })
    }
  }
}
</script>
<style>
.ccInfo {
    background: #f5f5f5;
    padding: 20px;
    overflow: hidden;
    border: 1px dashed #DDD;
    margin-bottom: 40px;
    position: relative;
}
.ccInfo img {
    background: #d6d6d6;
    width: 500px;
    height: 278px;
    display: block;
    float: left;
    border: none;
}
.ccInfo .main {
    margin-left: 520px;
}

.ccInfo .main h2 {
    font-size: 28px;
    margin-bottom: 30px;
    line-height: 1;
    font-weight: normal;
}
.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}

.ccInfo .main p {
    margin-bottom: 10px;
    word-wrap: break-word;
    line-height: 24px;
    max-height: 48px;
    overflow: hidden;
}
.ccInfo .main h3 {
    left: 540px;
    bottom: 20px;
    line-height: 1;
    font-size: 28px;
    color: #d32f24;
    font-weight: normal;
    position: absolute;
}
</style>
