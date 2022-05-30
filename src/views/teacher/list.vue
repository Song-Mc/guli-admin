<template>
  <div>
    <!-- 查询讲师列表的条件表单 -->
    <!--查询表单-->
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="searchObj.name" placeholder="讲师"/>
      </el-form-item>

      <el-form-item>
        <el-select v-model="searchObj.level" clearable placeholder="头衔">
          <el-option value="1" label="高级讲师"/>
          <el-option value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>

      <el-form-item label="入驻时间">
        <el-date-picker
          v-model="searchObj.joinDateBegin"
          placeholder="开始时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item label="-">
        <el-date-picker
          v-model="searchObj.joinDateEnd"
          placeholder="结束时间"
          value-format="yyyy-MM-dd" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form-item>
    </el-form>
    <el-button type="danger" style="margin-left:30px;" @click="batchDel">批量删除</el-button>
    <el-table
      :data="teachers"
      style="width: 100%;padding-left:30px;"
      @selection-change="handleSelectionChange">
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        type="index"
        width="50">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="50"/>
      <el-table-column
        prop="name"
        label="姓名"
        width="80"/>
      <el-table-column
        prop="avatar"
        label="头像"
        width="70">
        <template slot-scope="scope">
          <img v-if="scope.row.avatar" :src="scope.row.avatar" style="width:60px;height:60px" alt="" srcset="">
          <img v-else src="http://www.atguigu.com/teacher/new/liyuting.jpg" style="width:60px;height:60px" alt="">
        </template>
      </el-table-column>
      <el-table-column
        prop="level"
        label="头衔"
        width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level===1">高级讲师</el-tag>
          <el-tag v-else type="success">首席讲师</el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="intro"
        label="资历"
      />
      <el-table-column
        prop="sort"
        label="排序"
        width="80"/>
      <el-table-column
        prop="joinDate"
        label="入驻时间"
        width="180"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页导航条必须写在eltable外 -->
    <el-pagination
      :current-page="page"
      :total="total"
      :page-size="limit"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      style="padding: 30px 0; text-align: center;"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="changePageSize"
      @current-change="changeCurrentPage"/>
  </div>
</template>
<script>
import teacherApi from '@/api/teacher'
export default {
  data() {
    return {
      list: [],
      page: 1,
      limit: 3,
      total: 0,
      searchObj: {},
      teachers: []
    }
  },
  // 查询讲师列表
  // vue页面以后会通过路由映射引入交给main.js使用，main.js会将当前位置编写的js代码合并给vue对象
  created() {
    // this.getTeachers()
    this.fetchData()
  },
  methods: {
    // 批量删除的事件
    batchDel() {
      // 给用户确认提示()
      // 检查用户是否选中了要删除的行
      if (this.ids.length === 0) {
        this.$message.warning('请选择要删除的讲师')
        return
      }
      teacherApi.batchDelTeachers(this.ids).then(response => {
        this.$message.success('删除成功')
        this.getTeachersPage()// 刷新当前页面
      })
    },
    // 选中状态改变时的回调函数
    handleSelectionChange(val) {
      // 清空缓存
      this.ids = []
      // this.multipleSelection = val
      // 获取被选中的每一行对象的id
      // console.log(val)
      for (var i = 0; i < val.length; i++) {
        this.ids.push(val[i].id) // 将id加入到数组中
      }
      console.log(this.ids)
    },
    // 更新讲师的单击事件
    handleEdit(idx, row) {
      // console.log('更新讲师：')
      // console.log(row)
      // 跳转到teacher/form页面，并携带讲师id过去
      // 更新跳转到form页面时也提供一个路由配置
      this.$router.push('/teacher/edit/' + row.id)
    },
    handleDelete(idx, row) {
      this.$confirm(`此操作将永久删除讲师《${row.name}》, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认删除
        teacherApi.delTeacher(row.id).then(response => {
        // 弹出删除成功的提示，然后刷新页面
          this.$message.success('删除成功')
          this.getTeachersPage()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // console.log('删除讲师：')
      // console.log(row)
    },

    // 清空条件查询
    clearCon() {
      this.page = 1
      this.limit = 3
      this.searchObj = {}
      this.fetchData()
    },
    // 条件查询的单击事件
    queryTeachersPageByCon() {
      // 点击条件查询按钮时，默认查询条件数据的第一页
      this.page = 1
      // 因为表单收集的条件数据采用的是双绑，所以此方法调用getTeachersPage使用的查询对象属性值已经被设置了
      this.fetchData()
    },
    // 当改变了每页显示记录条数时回调此方法
    changePageSize(size) {
      // 接受size设置给vue对象的pageSize属性值，重新发起查询分页数据的请求
      this.limit = size
      this.fetchData()
    },
    // 当导航条的页码改变时回调此方法
    changeCurrentPage(page) {
      this.page = page
      this.fetchData()
    },
    // 查询讲师分页数据
    getTeachersPage() {
      teacherApi.pageList(this.page, this.limit, this.searchObj)
        .then(response => {
          console.log(response)
          // 获取讲师列表
          this.teachers = response.data.pageParam.records
          this.total = response.data.pageParam.total
        })
    },

    fetchData() {
    // 调用api
      teacherApi.pageList(this.page, this.limit, this.searchObj).then(response => {
        this.list = response.data.pageParam.records
        this.total = response.data.pageParam.total
      })
    }
  }
}
</script>
