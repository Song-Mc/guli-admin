import request from '@/utils/request'

export default{
  // 1、查询课程分类嵌套集合
  subjectNestedList() {
    return request({
      url: '/admin/edu/subject/subjectNestedList',
      method: 'GET'
    })
  }
}
