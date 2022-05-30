import request from '@/utils/request'

export default{
  // 3、查询课时
  getVideo(id) {
    return request({
      url: `/admin/edu/video/get-video/${id}`,
      method: 'GET'
    })
  },
  // 4、更新课时
  updateVideo(video) {
    return request({
      url: `/admin/edu/video/update-video`,
      method: 'put',
      data: video
    })
  },
  // 2、删除课时
  deleteVideo(id) {
    return request({
      url: `/admin/edu/video/delete-video/${id}`,
      method: 'DELETE'
    })
  },
  // 1、新增课时
  saveVideo(video) {
    return request({
      url: `/admin/edu/video/save-video`,
      method: 'post',
      data: video
    })
  }

}
