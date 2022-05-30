<template>
  <div class="app-container">
    <!--表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-date-picker
          v-model="begin"
          type="date"
          placeholder="选择开始日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="end"
          type="date"
          placeholder="选择截止日期"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-button
        :disabled="btnDisabled"
        type="primary"
        icon="el-icon-search"
        @click="showChart()">查询</el-button>
    </el-form>

    <el-row>
      <el-col :span="12">
        <div id="register_num" class="chart" style="height:500px;" />
      </el-col>
      <el-col :span="12">
        <div id="login_num" class="chart" style="height:500px;" />
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <div id="video_view_num" class="chart" style="height:500px;" />
      </el-col>
      <el-col :span="12">
        <div id="course_num" class="chart" style="height:500px;" />
      </el-col>
    </el-row>
  </div>
</template>
<script>
import statisticsApi from '@/api/statistics'
import echarts from 'echarts'
export default {
  data() {
    return {
      begin: '',
      end: '',
      btnDisabled: false
    }
  },
  methods: {
    initChart(divId, xData, yData) {
      // 基于准备好的dom，初始化echarts实例
      var myChart = echarts.init(document.getElementById(divId))

      // 指定图表的配置项和数据
      var option = {
        xAxis: {
          type: 'category',
          data: xData// ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          data: yData, // [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'bar'
        }]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    },
    showChart() {
      // 查询统计数据显示到echarts图标中
      statisticsApi.getStatistics(this.begin, this.end).then(response => {
        const resgiterMap = response.data.resgiterMap
        const courseMap = response.data.courseMap
        const loginMap = response.data.loginMap
        const videoViewMap = response.data.videoViewMap
        // 渲染数据到div容器中显示
        this.initChart('register_num', resgiterMap.xData, resgiterMap.yData)
        this.initChart('login_num', loginMap.xData, loginMap.yData)
        this.initChart('video_view_num', videoViewMap.xData, videoViewMap.yData)
        this.initChart('course_num', courseMap.xData, courseMap.yData)
      })
    }
  }
}
</script>
