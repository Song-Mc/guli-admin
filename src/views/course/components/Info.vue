<template>
  <div>
    <!--
      后端接受课程提交的三步的数据对应的key

     -->
    <el-form :model="courseInfo" label-width="80px" style="padding:30px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title"/>
      </el-form-item>
      <el-form-item label="课程讲师">
        <el-select v-model="courseInfo.teacherId" placeholder="请选择讲师">
          <el-option v-for="teacher in teachers" :key="teacher.id" :label="teacher.name" :value="teacher.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="课程类别">
        <el-select v-model="courseInfo.subjectParentId" @change="subjectParentIdChange">
          <el-option v-for="subject in levleOneSubjects" :key="subject.id" :label="subject.title" :value="subject.id"/>
        </el-select>
        <el-select v-model="courseInfo.subjectId">
          <el-option v-for="subject in levleTwoSubjects" :key="subject.id" :label="subject.title" :value="subject.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number v-model="courseInfo.lessonNum" :min="1" controls-position="right"/>
      </el-form-item>
      <el-form-item label="课程简介">
        <tinymce v-model="courseInfo.description"/>
      </el-form-item>
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleCoverSuccess"
          :before-upload="beforeCoverUpload"
          :action="BASE_API+'/admin/oss/file/upload?module=cover'"
          class="avatar-uploader">
          <img v-if="courseInfo.cover" :src="courseInfo.cover" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number v-model="courseInfo.price" :min="0" controls-position="right"/>元
      </el-form-item>
    </el-form>
    <div style="text-align:center">
      <el-button :disabled="flag" type="primary" @click="saveAndNext">保存并下一步</el-button>
    </div>
  </div>
</template>
<script>
import teacherApi from '@/api/teacher'
import courseApi from '@/api/course'
import subjectApi from '@/api/subject'
import Tinymce from '@/components/Tinymce'
export default {
  components: {
    Tinymce
  },
  /**
   * 在vue子组件中查找父组件：使用this.$parent
   * 在vue父组件中查找子组件：使用this.$children并不方便
   *                        一般采用ref，可以使用ref在父组件中给子组件命名：this.$refs.子组件名称
   */
  data() {
    return {
      BASE_API: process.env.BASE_API,
      courseInfo: {
        subjectId: ''
      },
      flag: false,
      teachers: [],
      levleOneSubjects: [], // 一级课程嵌套分类
      levleTwoSubjects: [] // 一级课程分类选择后的那个一级分类的二级课程分类
    }
  },
  created() {
    this.getTeacherList()
    this.getSubjectList()

    // 判断进入当前页面的请求是新增课程还是更新的回显
    if (this.$parent.courseId) {
      console.log('更新回显')
      // 根据课程id查询页面需要的数据回显
      this.getCourseInfo()
    }
  },
  methods: {
    // 查询要回显的课程基本信息
    getCourseInfo() {
      courseApi.getCourseInfo(this.$parent.courseId).then(response => {
        this.courseInfo = response.data.item
        // 异步查询成功后 根据查询的一级课程分类id查询他的二级分类集合
        this.levleOneSubjects.forEach(levelOneSubject => {
          if (levelOneSubject.id === this.courseInfo.subjectParentId) {
          // 获取他的二级分类集合
            this.levleTwoSubjects = levelOneSubject.children
          }
        })
      })
    },

    beforeCoverUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    },
    // 封面上传成功的回调
    handleCoverSuccess(res, file) {
      this.courseInfo.cover = res.data.path
      this.$forceUpdate()
    },
    subjectParentIdChange() {
      // 选择一级课程分类后，先删除之前的二级课程分类的选中
      this.courseInfo.subjectId = undefined
      // console.log(this.courseInfo.subjectParentId)
      // 根据一级分类的id查找它的二级分类集合
      this.levleOneSubjects.forEach(levelOneSubject => {
        if (levelOneSubject.id === this.courseInfo.subjectParentId) {
          // 获取他的二级分类集合
          this.levleTwoSubjects = levelOneSubject.children
          // this.courseInfo.subjectId = ''
          this.$forceUpdate()
        }
      })
    },
    // 查询一级课程分类嵌套集合
    getSubjectList() {
      subjectApi.subjectNestedList().then(response => {
        this.levleOneSubjects = response.data.items
      })
    },
    // 查询讲师列表
    getTeacherList() {
      teacherApi.getTeachers().then(response => {
        this.teachers = response.data.items
      })
    },
    saveAndNext() {
      this.flag = true
      if (this.$parent.courseId) {
        // 更新
        this.update()
      } else {
        // 新增
        this.save()
      }
    },
    save() {
      // 将上面收集的课程基本信息提交到后台保存
      courseApi.step1(this.courseInfo).then(response => {
        // 获取保存课程信息对应的id：存在三步vue组件的父组件中
        this.$parent.courseId = response.data.courseId
        console.log('课程id:' + this.$parent.courseId)
        // 课程基本信息保存成功跳转到下一个页面
        this.$parent.step = 1
      })
    },
    update() {
      courseApi.updateCourseInfo(this.courseInfo, this.$parent.courseId).then(
        response => {
          this.$message.success('更新成功')
          this.$parent.step = 1
        }
      )
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 356px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 356px;
    height: 178px;
    display: block;
  }
</style>
