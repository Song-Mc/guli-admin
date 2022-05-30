import request from '@/utils/request'

export default{
  // 2、获取统计数据
  getStatistics(begin, end) {
    return request({
      url: `/admin/statistics/daily/get-statistics/${begin}/${end}`,
      method: 'GET'
    })
  },

  generateData(day) {
    return request({
      url: `/admin/statistics/daily/generate/${day}`,
      method: 'POST'
    })
  }
}
