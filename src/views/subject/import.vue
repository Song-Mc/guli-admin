<template>
  <div>
    <!-- <el-row>
      <el-col :span="4" style="text-align:right"><div>信息描述</div></el-col>
      <el-col :span="20"><div>
        <el-button>excel模板说明</el-button>
        <el-button type="primary">点击下载模板</el-button>
      </div></el-col>
    </el-row> -->
    <el-form label-width="120px" style="margin-top:20px">
      <el-form-item label="信息描述">
        <el-tag type="info">excel模版说明</el-tag>
        <el-tag>
          <i class="el-icon-download"/>
          <a :href="excelUrl">点击下载模版</a>
        </el-tag>
      </el-form-item>
      <el-form-item label="选择Excel">
        <el-upload
          ref="upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :on-exceed="handleExceed"
          :file-list="fileList"
          :auto-upload="false"
          :action="uploadUrl"
          :limit="1"
          name="subjectFile"
          class="upload-demo">
          <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
          <el-button :disabled="flag" style="margin-left: 10px;" size="small" type="success" @click="submitUpload">导入</el-button>
          <div slot="tip" class="el-upload__tip">只能上传excel文件(格式:xls/xlsx)，且不超过1个</div>
        </el-upload>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
export default {
  data() {
    return {
      flag: false,
      // 为了保证地址后端可以正确的处理，提交请求时，客户端一定会对url地址进行URLEncode编码，后端接受时默认会采用URLDecoder还原
      excelUrl: 'https://sh200821-gulionline.oss-cn-shanghai.aliyuncs.com/excel/课程分类列表模板.xls',
      fileList: [],
      uploadUrl: process.env.BASE_API + '/admin/edu/subject/import'
    }
  },
  methods: {
    handleExceed() {
      this.$message.warning('最多只能选择一个文件')
    },
    handleSuccess(response, file, fileList) {
      fileList = []
      // console.log(response)
      this.$message.success(response.message)
    },
    submitUpload() {
      this.flag = true
      this.$refs.upload.submit()
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>
