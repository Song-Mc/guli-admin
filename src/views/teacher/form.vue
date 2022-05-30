<template>
  <div>
    <el-form label-width="80px" style="padding:30px">
      <el-form-item label="讲师姓名">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro"/>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" placeholder="请选择头衔">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" :min="0" controls-position="right" />
      </el-form-item>
      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="teacher.joinDate"
          type="date"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <!-- 收集讲师头像地址，涉及文件上传：TODO -->
      <el-form-item label="讲师头像">
        <!-- action：上传图片的接口地址
                上传文件的表单项上传文件时请求是不是由request.js中的axios发起的
              on-success：上传文件成功后的回调，可以在此方法中接受上传后的结果
              before-upload：上传之前的操作，可以验证文件格式和大小
         -->
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/admin/oss/file/upload?module=avatar'"
          class="avatar-uploader">
          <img v-if="teacher.avatar" :src="teacher.avatar" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"/>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveOrUpdate">提交</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import teacherApi from '@/api/teacher'
export default {
  data() {
    return {
      BASE_API: process.env.BASE_API,
      teacher: {
        sort: 0,
        level: 1,
        joinDate: '' // 回显时 如果不指定格式，有可能标签不能回显
      }
    }
  },
  created() {
    // 只有更新操作才需要查询讲师回显
    if (this.$route.params.tid) {
    // 获取访问当前页面的路由的 tid参数
    // console.log(this.$route.params.tid)
    // 查询id对应的讲师信息回显
      teacherApi.getTeacher(this.$route.params.tid).then(response => {
      // this.teacher = response.data.item //解决gmtCreate被修改的方案：1、后端响应查询的teacher对象时自己封装Vo类，响应页面需要使用的字段即可  2、前端接收数据时只接受需要使用的数据
        this.teacher.name = response.data.item.name
        this.teacher.intro = response.data.item.intro
        this.teacher.career = response.data.item.career
        this.teacher.sort = response.data.item.sort
        this.teacher.level = response.data.item.level
        this.teacher.joinDate = response.data.item.joinDate
        this.teacher.id = response.data.item.id
        this.teacher.avatar = response.data.item.avatar
      })
    }
  },
  methods: {
    // 上传成功后的回调
    // 参数1：为res：        参数2：代表上传时选择的本地文件对象
    handleAvatarSuccess(res, file) {
      // this.imageUrl = URL.createObjectURL(file.raw)
      console.log('上传成功的响应对象:')
      console.log(res)
      this.teacher.avatar = res.data.path
      // 强制渲染vue内部的标签回显图片
      this.$forceUpdate()
    },
    // 对图片进行的验证
    beforeAvatarUpload(file) {
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
    // 提交按钮的单击事件
    saveOrUpdate() {
      // 判断当前操作是新增还是更新
      if (this.teacher.id) { // if判断如果有值就代表true
        this.update()
      } else {
        this.save()
      }
    },
    // 更新讲师
    update() {
      teacherApi.updateTeacher(this.teacher).then(response => {
        this.$message.success('更新成功')
        // 新增成功跳转回讲师列表页面
        // this.$router 获取vueRouter对象（包含多个route的映射）
        // this.$route  获取当前vue页面所在的路由对象
        this.$router.push('/teacher/list') // 传入在路由中配置的地址可以直接跳转
      })
    },
    // 新增讲师
    save() {
      teacherApi.saveTeacher(this.teacher).then(response => {
        this.$message.success('新增成功')
        // 新增成功跳转回讲师列表页面
        // this.$router 获取vueRouter对象（包含多个route的映射）
        // this.$route  获取当前vue页面所在的路由对象
        this.$router.push('/teacher/list') // 传入在路由中配置的地址可以直接跳转
      })
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
