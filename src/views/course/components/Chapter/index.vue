<template>
  <div>
    <!-- 添加章节按钮 -->
    <div>
      <el-button type="primary" @click="showChapterDialog">添加章节</el-button>
    </div>

    <!-- 章节列表 -->
    <ul class="chapterList">
      <li
        v-for="chapter in chapterList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="showVideDialog(chapter.id)">添加课时</el-button>
            <el-button type="text" @click="showUpdateDialog(chapter.id)">编辑</el-button>
            <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>
              {{ video.title }}
              <el-tag v-if="!video.videoSourceId" size="mini" type="danger">
                {{ '尚未上传视频' }}
              </el-tag>
              <span class="acts">
                <el-tag v-if="video.free" size="mini" type="success">{{ '免费观看' }}</el-tag>
                <el-button type="text" @click="showUpdateVideoDialog(video.id)">编辑</el-button>
                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 章节表单对话框 TODO -->
    <chapter-form ref="chapterDialog"/>
    <!--   课时表单对话框 TODO -->
    <video-form ref="videoDailog"/>
    <div style="text-align:center">
      <el-button :disabled="preFlag" type="primary" @click="pre">上一步</el-button>
      <el-button :disabled="nextFlag" type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>
<script>
import chapterApi from '@/api/chapter'
import videoApi from '@/api/video'
// 引入章from组件
import ChapterForm from '@/views/course/components/Chapter/Form'
import VideoForm from '@/views/course/components/Video/Form'
export default {
  components: {
    ChapterForm, VideoForm
  },
  /**
   * 在vue子组件中查找父组件：使用this.$parent
   * 在vue父组件中查找子组件：使用this.$children并不方便
   *                        一般采用ref，可以使用ref在父组件中给子组件命名：this.$refs.子组件名称
   */
  data() {
    return {
      chapterList: [],
      preFlag: false,
      nextFlag: false
    }
  },
  created() {
    this.getChapterNestedList()
  },
  methods: {
    // 显示编辑课时的对话框
    showUpdateVideoDialog(videoId) {
      this.$refs.videoDailog.getVideoById(videoId)
      // open(chapterId)
    },
    // 删除课时
    deleteVideo(videoId) {
      // alert(videoId)
      videoApi.deleteVideo(videoId).then(response => {
        this.$message.success('删除课时成功')
        this.getChapterNestedList()
      })
    },

    // 显示收集课时信息对话框
    showVideDialog(chapterId) {
      this.$refs.videoDailog.open(chapterId)
    },

    // 显示更新章节对话框
    showUpdateDialog(chapterId) {
      // 获取子组件ChapterForm 调用open方法显示dialog：并传入要更新的章节的id
      this.$refs.chapterDialog.open(chapterId)
    },
    // 删除章节方法        // 要获取被点击按钮所在行的章节id
    // alert(chapterId)
    deleteChapter(chapterId) {
      this.$confirm('此操作将永久删除该章节, 是否继续?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        chapterApi.deleteChapter(chapterId).then(response => {
          this.$message.success('删除成功')
          this.getChapterNestedList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 查询课程章节课时嵌套集合
    getChapterNestedList() {
      chapterApi.getChapterNestedList(this.$parent.courseId).then(response => {
        this.chapterList = response.data.items
      })
    },
    // 显示收集章节信息的对话框
    showChapterDialog() {
      this.$refs.chapterDialog.open()
    },

    pre() {
      this.preFlag = true
      this.$parent.step = 0
    },
    next() {
      this.nextFlag = true
      this.$parent.step = 2
    }
  }
}
</script>
<style>
.chapterList{
    position: relative;
    list-style: none;
    margin: 0;
    padding: 0;
}
.chapterList li{
  position: relative;
}
.chapterList p{
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}
.chapterList .acts {
    float: right;
    font-size: 14px;
}

.videoList{
  padding-left: 50px;
}
.videoList p{
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dashed #DDD;
}
</style>
