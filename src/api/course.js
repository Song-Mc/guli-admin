import request from '@/utils/request'

export default{
  // 5、发布课程
  publishCourse(courseId) {
    return request({
      url: `/admin/edu/course/publish-course/${courseId}`,
      method: 'PUT'
    })
  },
  // 4、查询发布课程信息
  getCoursePublish(courseId) {
    return request({
      url: `/admin/edu/course/get-coursevo/${courseId}`,
      method: 'GET'
    })
  },
  // 3、更新课程基本信息
  updateCourseInfo(courseInfo, courseId) {
    return request({
      url: `/admin/edu/course/update-course-info/${courseId}`,
      method: 'PUT',
      data: courseInfo
    })
  },
  // 2、查询课程基本信息
  getCourseInfo(courseId) {
    return request({
      url: `/admin/edu/course/get-course-info/${courseId}`,
      method: 'GET'
    })
  },
  // 1、第一步：保存课程基本信息
  step1(courseInfo) {
    return request({
      url: '/admin/edu/course/save-course-info',
      method: 'POST',
      data: courseInfo
    })
  }
}
