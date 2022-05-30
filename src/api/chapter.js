import request from '@/utils/request'

export default{
  // 5、更新章节
  updateChapter(chapter) {
    return request({
      url: `/admin/edu/chapter/update-chapter`,
      method: 'PUT',
      data: chapter
    })
  },
  // 4、查询指定章节
  getChapter(chapterId) {
    return request({
      url: `/admin/edu/chapter/get-chapter/${chapterId}`,
      method: 'GET'
    })
  },
  // 3、删除章节
  deleteChapter(chapterId) {
    return request({
      url: `/admin/edu/chapter/delete-chapter/${chapterId}`,
      method: 'DELETE'
    })
  },
  // 2、查询章节课时嵌套集合
  getChapterNestedList(courseId) {
    return request({
      url: `/admin/edu/chapter/chapterNestedList/${courseId}`,
      method: 'GET'
    })
  },
  // 1、新增章节信息
  saveChapter(chapter) {
    return request({
      url: `/admin/edu/chapter/save-chapter`,
      method: 'POST',
      data: chapter
    })
  }
}
