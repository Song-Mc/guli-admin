<template>
  <!-- 准备收集章信息的消息框 -->
  <el-dialog :visible.sync="dialogFormVisible" title="添加章节">
    <el-form :model="chapter">
      <el-form-item label="章节标题" label-width="120px">
        <el-input v-model="chapter.title" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="章节排序" label-width="120px">
        <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="saveOrUpdateChapter">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import chapterApi from '@/api/chapter'
export default {
  data() {
    return {
      chapter: {
        sort: 0
      },
      dialogFormVisible: false // 默认不显示对话框
    }
  },
  methods: {
    // 显示dialog的方法
    open(chapterId) {
      // 如果有chapterId代表更新
      console.log('章节id:' + chapterId)
      if (chapterId) {
        // 查询章节信息并回显
        this.getChapterById(chapterId)
      } else {
        this.dialogFormVisible = true
      }
    },
    getChapterById(chapterId) {
      chapterApi.getChapter(chapterId).then(response => {
        this.chapter.id = response.data.item.id
        this.chapter.sort = response.data.item.sort
        this.chapter.title = response.data.item.title
        // 查询章节信息成功后再回显
        this.dialogFormVisible = true
      })
    },
    close() {
      this.dialogFormVisible = false
      // 清除之前的章节缓存
      this.chapter = {
        sort: 0
      }
    },
    saveOrUpdateChapter() {
      if (this.chapter.id) {
        this.update()
      } else {
        this.save()
      }
    },
    update() {
      chapterApi.updateChapter(this.chapter).then(response => {
        // 更新成功，关闭对话框+提示
        this.$message.success('更新成功')
        this.close()
        // 刷新父组件
        this.$parent.getChapterNestedList()
      })
    },
    save() {
      // 保存章信息
      // 需要保存章的标题、排序以及它所在的课程id
      this.chapter.courseId = this.$parent.$parent.courseId
      chapterApi.saveChapter(this.chapter).then(response => {
        this.$message.success('新增章节成功')
        // 调用chapterForm的父组件ChapterIndex的获取章节课时嵌套集合的方法
        this.$parent.getChapterNestedList()
        // this.$parent.$parent.courseId
        // 关闭chapter
        this.close()
      })
    }
  }
}
</script>
