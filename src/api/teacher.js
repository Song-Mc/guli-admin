// 引入axios js
import request from '@/utils/request'
// 封装讲师管理接口调用的方法
export default{
  // 7、批量删除
  batchDelTeachers(ids) {
    return request({
      url: `/admin/edu/teacher/batchDel`,
      method: 'delete',
      params: { 'ids': ids.join(',') } // ids是数组需要转为 每两个元素使用,分割的字符串
    })
  },
  // 6、更新讲师
  updateTeacher(teacher) {
    return request({
      url: `/admin/edu/teacher/update`,
      method: 'post',
      data: teacher // data提交的json数据后端必须通过@RequestBody 入参
    })
  },
  // 5、根据id查询讲师
  getTeacher(id) {
    return request({
      url: `/admin/edu/teacher/get/${id}`,
      method: 'get'
    })
  },
  // 4、新增讲师
  saveTeacher(teacher) {
    return request({
      url: `/admin/edu/teacher/save`,
      method: 'post',
      data: teacher // data提交的json数据后端必须通过@RequestBody 入参
    })
  },
  // 3、删除指定讲师
  delTeacher(id) {
    return request({
      url: `/admin/edu/teacher/remove/${id}`,
      method: 'delete'
    })
  },
  // 2、分页查询讲师列表
  pageList(page, limit, searchObj) {
    return request({
      url: `/admin/edu/teacher/list/${page}/${limit}`,
      method: 'get',
      // axios会自动将params的参数值以 kv的方式拼接在url后进行提交
      params: searchObj // params代表以请求参数的方式提交数据， queryObj代表后台接受的讲师查询条件对象 属性名需要和查询条件对象一样
    })
  },
  // 1、查询所有讲师
  list() {
    return request({
      url: '/admin/edu/teacher/list',
      method: 'get'
    })
  }
}
