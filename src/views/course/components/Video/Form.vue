<template>
  <!-- 准备收集章信息的消息框 -->
  <el-dialog :visible.sync="dialogFormVisible" title="添加课时">
    <el-form :model="video">
      <el-form-item label="课时标题" label-width="120px">
        <el-input v-model="video.title" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="课时排序" label-width="120px">
        <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
      </el-form-item>
      <el-form-item label="是否免费" label-width="120px">
        <el-radio v-model="video.free" :label="1">免费</el-radio>
        <el-radio v-model="video.free" :label="0">收费</el-radio>
      </el-form-item>
      <!-- 上传视频 -->
      <el-form-item label="上传视频" label-width="120px">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :on-exceed="handleUploadExceed"
          :file-list="fileList"
          :limit="1"
          :action="BASE_API+'/admin/vod/media/upload'">
          <el-button slot="trigger" size="small" type="primary">选择视频</el-button>
          <el-button
            :disabled="uploadBtnDisabled"
            style="margin-left: 10px;"
            size="small"
            type="success"
            @click="submitUpload()">上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import videoApi from '@/api/video'
export default {
  data() {
    return {
      BASE_API: process.env.BASE_API,
      uploadBtnDisabled: false,
      fileList: [],
      video: {
        sort: 0,
        free: 0
      },
      dialogFormVisible: false
    }
  },
  methods: {
    // 上传文件的按钮单击事件
    submitUpload() {
      this.uploadBtnDisabled = true
      this.$refs.upload.submit()
    },
    // 上传成功回调: 后端HTTP响应状态码为200时的回调
    handleUploadSuccess(response, file, fileList) {
      this.uploadBtnDisabled = false
      if (response.success) {
        // 获取上传成功的videoId和视频的其他信息设置给video对象
        this.video.videoSourceId = response.data.videoId
        this.video.videoOriginalName = file.name

        this.$message.success('视频上传成功')
      } else {
        this.$message.error('上传失败1')
      }
    },
    handleUploadError() {
      this.uploadBtnDisabled = false
      this.$message.error('上传失败2')
    },
    // 超过文件个数限制回调
    handleUploadExceed() {
      this.$message.warning('只能上传一个视频')
    },
    getVideoById(videoId) {
      // 查询课时信息并回显 弹出对话框
      videoApi.getVideo(videoId).then(response => {
        this.video.id = response.data.item.id
        this.video.sort = response.data.item.sort
        this.video.free = response.data.item.free ? 1 : 0
        this.video.title = response.data.item.title
        // 接受video的视频名称回显
        this.fileList = [{ 'name': response.data.item.videoOriginalName }]
        console.log(this.video.free)
        this.dialogFormVisible = true
      })
    },
    saveOrUpdateVideo() {
      if (this.video.id) {
        this.update()
      } else {
        this.save()
      }
    },
    update() {
      videoApi.updateVideo(this.video).then(response => {
        this.$message.success('更新课时成功')
        // 关闭dialog
        this.close()
        // 通知父组件刷新
        this.$parent.getChapterNestedList()
      })
    },
    save() {
      videoApi.saveVideo(this.video).then(response => {
        this.$message.success('新增课时成功')
        // 关闭dialog
        this.close()
        // 通知父组件刷新
        this.$parent.getChapterNestedList()
      })
    },
    close() {
      this.dialogFormVisible = false
      this.video = {
        sort: 0,
        free: 0
      }
      // 清空文件列表缓存
      this.fileList = []
    },
    open(chapterId) {
      this.dialogFormVisible = true
      // 先给video设置需要的属性值
      this.video.chapterId = chapterId
      this.video.courseId = this.$parent.$parent.courseId
    }
  }
}
</script>
